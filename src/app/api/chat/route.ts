import { NextRequest, NextResponse } from 'next/server'

const PERPLEXITY_KEY = process.env.PERPLEXITY_API_KEY
const APIFY_TOKEN = process.env.APIFY_TOKEN
const ACTOR_ID = 'compass~crawler-google-places'

// Extrai intenção de busca da mensagem do usuário
function extrairIntencao(msg: string): { nicho: string | null; cidade: string | null } {
  const msg_lower = msg.toLowerCase()

  // Cidades comuns SP
  const cidades = [
    'arujá', 'aruja', 'mogi das cruzes', 'guarulhos', 'são paulo', 'sao paulo',
    'campinas', 'suzano', 'itaquaquecetuba', 'poá', 'poa', 'ferraz', 'santa isabel'
  ]

  // Nichos comuns
  const nichos = [
    'barbearia', 'barbeiro', 'salão', 'salao', 'cabelereiro', 'cabeleireiro', 'cabelereira',
    'restaurante', 'pizzaria', 'lanchonete', 'academia', 'pet shop', 'pet',
    'farmácia', 'farmacia', 'dentista', 'mecânica', 'mecanica', 'padaria',
    'estética', 'estetica', 'hotel', 'escola', 'imobiliaria', 'imobiliária',
    'açougue', 'acougue', 'mercado', 'supermercado', 'clínica', 'clinica',
    'advocacia', 'contabilidade', 'oficina', 'borracharia'
  ]

  let cidade: string | null = null
  let nicho: string | null = null

  for (const c of cidades) {
    if (msg_lower.includes(c)) {
      cidade = c.charAt(0).toUpperCase() + c.slice(1)
      break
    }
  }

  for (const n of nichos) {
    if (msg_lower.includes(n)) {
      nicho = n.charAt(0).toUpperCase() + n.slice(1)
      break
    }
  }

  return { nicho, cidade }
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { message, history = [] } = body

  if (!message) {
    return NextResponse.json({ error: 'message obrigatório' }, { status: 400 })
  }

  // Tenta extrair intenção de busca
  const { nicho, cidade } = extrairIntencao(message)
  const querBuscar = nicho && cidade

  // Resposta de busca direta (sem LLM) se tiver nicho + cidade
  if (querBuscar && APIFY_TOKEN) {
    // Dispara busca no Apify em background e retorna preview rápido
    return NextResponse.json({
      type: 'search_trigger',
      message: `🔍 Entendido! Buscando **${nicho}** em **${cidade}** agora...`,
      search: { nicho, cidade },
    })
  }

  // Se não tem Perplexity key, resposta estática inteligente
  if (!PERPLEXITY_KEY) {
    return NextResponse.json({
      type: 'message',
      message: gerarRespostaEstatica(message),
    })
  }

  // Chat via Perplexity
  const systemPrompt = `Você é o assistente de prospecção da NEW Agency, uma agência digital brasileira especializada em transformar negócios locais em marcas digitais.

Sua função: ajudar o usuário a encontrar leads qualificados — negócios locais com alta demanda mas presença digital fraca (sem site, sem Instagram profissional, sem identidade visual).

Sempre que o usuário mencionar um nicho (ex: barbearia, salão, restaurante) e uma cidade brasileira, extraia essas informações e pergunte se deseja iniciar a busca.

Se o usuário perguntar sobre a NEW Agency: somos uma agência de design e marketing digital que cria sites profissionais, identidade visual e gestão de redes sociais para negócios locais que já têm demanda mas ainda não aparecem online. Site: newperfect.netlify.app

Seja direto, prático e fale português brasileiro informal.`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6), // últimas 6 mensagens
    { role: 'user', content: message },
  ]

  const pplxRes = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PERPLEXITY_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar',
      messages,
      max_tokens: 400,
      temperature: 0.7,
    }),
  })

  const pplxData = await pplxRes.json()
  const reply = pplxData.choices?.[0]?.message?.content || 'Desculpe, não entendi. Tente novamente.'

  // Tenta extrair intenção da resposta
  const intencaoResposta = extrairIntencao(reply)

  return NextResponse.json({
    type: 'message',
    message: reply,
    search: intencaoResposta.nicho && intencaoResposta.cidade ? intencaoResposta : undefined,
  })
}

function gerarRespostaEstatica(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('oi') || lower.includes('olá') || lower.includes('ola') || lower.includes('boa')) {
    return `Oi! 👋 Sou o assistente da **NEW Agency**. Posso buscar leads qualificados pra você!\n\nMe diga o **nicho** e a **cidade**, por exemplo:\n\n> "Buscar barbearias em Arujá"\n> "Quero salões de beleza em Guarulhos"\n> "Restaurantes em Mogi das Cruzes"`
  }
  if (lower.includes('new agency') || lower.includes('empresa') || lower.includes('vocês')) {
    return `A **NEW Agency** é uma agência digital especializada em transformar negócios locais em marcas profissionais online. 🚀\n\nFazemos:\n- Sites profissionais\n- Identidade visual\n- Instagram e redes sociais\n- Tráfego pago\n\nNosso foco são negócios que já têm clientes mas ainda não aparecem no digital. [Ver portfólio](https://newperfect.netlify.app)`
  }
  return `Me diga o **nicho** e a **cidade** que você quer prospectar, por exemplo:\n\n> "Barbearias em Arujá"\n> "Salões de cabeleireiro em Guarulhos"\n\nVou buscar os leads qualificados pra você automaticamente! 🎯`
}
