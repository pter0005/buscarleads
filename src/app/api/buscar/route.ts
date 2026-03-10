import { NextRequest, NextResponse } from 'next/server'

const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY

// Mapeia nicho em linguagem natural para o type do Google Places
const NICHE_MAP: Record<string, string[]> = {
  barbearia: ['barber_shop'],
  salão: ['hair_salon', 'beauty_salon'],
  salao: ['hair_salon', 'beauty_salon'],
  restaurante: ['restaurant'],
  pizzaria: ['pizza_restaurant', 'restaurant'],
  lanchonete: ['fast_food_restaurant', 'restaurant'],
  academia: ['gym'],
  pet: ['pet_store', 'veterinary_care'],
  veterinário: ['veterinary_care'],
  veterinario: ['veterinary_care'],
  farmácia: ['pharmacy'],
  farmacia: ['pharmacy'],
  dentista: ['dentist'],
  médico: ['doctor'],
  medico: ['doctor'],
  mecânica: ['car_repair'],
  mecanica: ['car_repair'],
  supermercado: ['supermarket'],
  padaria: ['bakery'],
  escola: ['school'],
  advocacia: ['lawyer'],
  contabilidade: ['accounting'],
  hotel: ['hotel'],
  pousada: ['lodging'],
  loja: ['store', 'shopping_mall'],
  estética: ['beauty_salon', 'spa'],
  estetica: ['beauty_salon', 'spa'],
  spa: ['spa'],
  oficina: ['car_repair'],
  imobiliaria: ['real_estate_agency'],
  imobiliária: ['real_estate_agency'],
}

function resolveType(nicho: string): string {
  const lower = nicho.toLowerCase().trim()
  for (const [key, types] of Object.entries(NICHE_MAP)) {
    if (lower.includes(key)) return types[0]
  }
  // fallback: usa o nicho como keyword
  return 'establishment'
}

function resolveKeyword(nicho: string): string {
  const lower = nicho.toLowerCase().trim()
  for (const key of Object.keys(NICHE_MAP)) {
    if (lower.includes(key)) return key
  }
  return nicho
}

export async function POST(req: NextRequest) {
  if (!GOOGLE_API_KEY) {
    return NextResponse.json({ error: 'GOOGLE_PLACES_API_KEY não configurada' }, { status: 500 })
  }

  const body = await req.json()
  const { nicho, cidade, estado = 'SP' } = body

  if (!nicho || !cidade) {
    return NextResponse.json({ error: 'nicho e cidade são obrigatórios' }, { status: 400 })
  }

  // Step 1: Geocode da cidade
  const geoRes = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(`${cidade}, ${estado}, Brasil`)}&key=${GOOGLE_API_KEY}`
  )
  const geoData = await geoRes.json()

  if (!geoData.results?.[0]) {
    return NextResponse.json({ error: 'Cidade não encontrada' }, { status: 404 })
  }

  const { lat, lng } = geoData.results[0].geometry.location

  // Step 2: Nearby Search (New API)
  const placeType = resolveType(nicho)
  const keyword = resolveKeyword(nicho)

  const searchBody = {
    includedTypes: [placeType],
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 10000,
      },
    },
    rankPreference: 'RATING',
    maxResultCount: 20,
  }

  const placesRes = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': [
        'places.displayName',
        'places.formattedAddress',
        'places.nationalPhoneNumber',
        'places.internationalPhoneNumber',
        'places.websiteUri',
        'places.rating',
        'places.userRatingCount',
        'places.regularOpeningHours',
        'places.id',
        'places.types',
        'places.photos',
        'places.editorialSummary',
      ].join(','),
    },
    body: JSON.stringify(searchBody),
  })

  const placesData = await placesRes.json()

  if (!placesData.places) {
    return NextResponse.json({ leads: [], total: 0, query: { nicho, cidade, estado } })
  }

  // Step 3: Transformar em formato Lead
  const leads = placesData.places.map((place: any, i: number) => {
    const nome = place.displayName?.text || 'Sem nome'
    const site = place.websiteUri || null
    const telefone = place.nationalPhoneNumber || null
    const avaliacao = place.rating || null
    const reviews = place.userRatingCount || 0
    const horario = place.regularOpeningHours?.weekdayDescriptions?.[0] || null
    const endereco = place.formattedAddress || `${cidade}, ${estado}`

    // Score SWAS
    let score = 0
    const motivos: string[] = []

    if (!site) { score += 35; motivos.push('Sem site próprio') }
    if (reviews > 30 && !site) { score += 18; motivos.push('🔥 Movimentado sem site') }
    if (reviews > 50) { score += 8; motivos.push('Alta demanda orgânica') }
    if (avaliacao && avaliacao >= 4.5 && !site) { score += 10; motivos.push('⭐ Alta avaliação sem presença') }
    if (!telefone) { score += 5; motivos.push('Difícil de contatar') }
    else { score = Math.max(0, score) }

    return {
      id: place.id || `lead-${i}`,
      nome,
      nicho,
      endereco,
      bairro: '',
      cidade,
      estado,
      telefone,
      whatsapp: null,
      email: null,
      instagram: null,
      ig_profissional: false,
      identidade_visual: false,
      site,
      avaliacao,
      reviews,
      horario,
      nome_dono: null,
      score: Math.min(score, 100),
      motivos: motivos.length > 0 ? motivos : ['Verificar presença digital'],
      status: 'novo',
      favoritado: false,
      createdAt: new Date().toISOString(),
    }
  }).sort((a: any, b: any) => b.score - a.score)

  return NextResponse.json({ leads, total: leads.length, query: { nicho, cidade, estado } })
}
