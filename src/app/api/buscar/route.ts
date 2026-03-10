import { NextRequest, NextResponse } from 'next/server'

const APIFY_TOKEN = process.env.APIFY_TOKEN
const ACTOR_ID = 'compass~crawler-google-places'

export async function POST(req: NextRequest) {
  if (!APIFY_TOKEN) {
    return NextResponse.json({ error: 'APIFY_TOKEN não configurado' }, { status: 500 })
  }

  const body = await req.json()
  const { nicho, cidade, estado = 'SP', maxResults = 20 } = body

  if (!nicho || !cidade) {
    return NextResponse.json({ error: 'nicho e cidade são obrigatórios' }, { status: 400 })
  }

  // 1. Dispara o Actor do Apify (sync - aguarda até 5 min)
  const runRes = await fetch(
    `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}&memory=512&timeout=120`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchStringsArray: [`${nicho} em ${cidade} ${estado}`],
        locationQuery: `${cidade}, ${estado}, Brasil`,
        maxCrawledPlacesPerSearch: maxResults,
        language: 'pt',
        includeWebResults: false,
        scrapeContacts: true,
      }),
    }
  )

  if (!runRes.ok) {
    const err = await runRes.text()
    return NextResponse.json({ error: `Apify error: ${err}` }, { status: 500 })
  }

  const places: any[] = await runRes.json()

  // 2. Transforma nos nossos Leads com Score SWAS
  const leads = places
    .filter((p) => p.title)
    .map((place, i) => {
      const nome = place.title || 'Sem nome'
      const site = place.website || null
      const telefone = place.phone || place.phoneUnformatted || null
      const whatsapp = detectWhatsApp(place)
      const email = place.email || extractEmail(place.contactInfo) || null
      const instagram = extractIG(place)
      const avaliacao = place.totalScore || null
      const reviews = place.reviewsCount || 0
      const horario = place.openingHours?.[0]
        ? `${place.openingHours[0].day}: ${place.openingHours[0].hours}`
        : null
      const endereco = place.address || `${cidade}, ${estado}`
      const bairro = place.neighborhood || ''
      const ig_profissional = instagram ? detectIGProfissional(place) : false
      const identidade_visual = !!(site && instagram)

      // Score SWAS
      let score = 0
      const motivos: string[] = []

      if (!site) { score += 35; motivos.push('Sem site próprio') }
      if (!instagram) { score += 20; motivos.push('Sem Instagram') }
      else if (!ig_profissional) { score += 12; motivos.push('IG amador') }
      if (!identidade_visual) { score += 10; motivos.push('Sem identidade visual') }
      if (reviews > 30 && !site) { score += 18; motivos.push('🔥 Movimentado sem site') }
      if (reviews > 50) { score += 8; motivos.push('Alta demanda orgânica') }
      if (avaliacao && avaliacao >= 4.5 && !site) { score += 10; motivos.push('⭐ Alta avaliação sem presença') }
      if (!whatsapp && !telefone) { score += 5; motivos.push('Difícil de contatar') }

      return {
        id: place.placeId || `lead-${i}`,
        nome,
        nicho,
        endereco,
        bairro,
        cidade,
        estado,
        telefone,
        whatsapp,
        email,
        instagram,
        ig_profissional,
        identidade_visual,
        site,
        avaliacao,
        reviews,
        horario,
        nome_dono: null,
        score: Math.min(score, 100),
        motivos: motivos.length > 0 ? motivos : ['✅ Boa presença digital'],
        status: 'novo',
        favoritado: false,
        createdAt: new Date().toISOString(),
      }
    })
    .sort((a, b) => b.score - a.score)

  return NextResponse.json({ leads, total: leads.length, query: { nicho, cidade, estado } })
}

// Helpers
function extractIG(place: any): string | null {
  const ig =
    place.instagrams?.[0] ||
    place.contactInfo?.find((c: any) => c.type === 'instagram')?.value ||
    null
  return ig || null
}

function detectWhatsApp(place: any): string | null {
  const whatsapp = place.contactInfo?.find((c: any) =>
    c.type?.toLowerCase().includes('whatsapp')
  )?.value
  return whatsapp || null
}

function extractEmail(contactInfo: any[]): string | null {
  if (!contactInfo) return null
  return contactInfo.find((c) => c.type === 'email')?.value || null
}

function detectIGProfissional(place: any): boolean {
  const followers = place.instagramFollowers || 0
  return followers > 500
}
