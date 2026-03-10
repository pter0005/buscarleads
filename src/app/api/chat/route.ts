import { NextRequest, NextResponse } from 'next/server'

const GEMINI_KEY = process.env.GEMINI_API_KEY
const APIFY_TOKEN = process.env.APIFY_TOKEN

const CIDADES = [
  'arujá', 'aruja', 'mogi das cruzes', 'guarulhos', 'são paulo', 'sao paulo',
  'campinas', 'suzano', 'itaquaquecetuba', 'poá', 'poa', 'ferraz de vasconcelos',
  'santa isabel', 'brasília', 'brasilia', 'curitiba', 'belo horizonte',
  'salvador', 'fortaleza', 'manaus', 'recife', 'porto alegre', 'belém', 'belem',
  'ribeirão preto', 'ribeirao preto', 'sorocaba', 'santos', 'osasco', 'florianópolis',
]

const NICHOS = [
  'barbearia', 'barbeiro', 'salão', 'salao', 'cabeleireiro', 'cabelereira', 'cabeleireiros',
  'restaurante', 'pizzaria', 'lanchonete', 'hamburgueria', 'academia', 'pet shop', 'pet',
  'farmácia', 'farmacia', 'dentista', 'odontologia', 'mecânica', 'mecanica', 'padaria',
  'estética', 'estetica', 'hotel', 'pousada', 'escola', 'imobiliária', 'imobiliaria',
  'açougue', 'acougue', 'mercado', 'supermercado', 'clínica', 'clinica',
  'advocacia', 'advogado', 'contabilidade', 'oficina', 'borracharia', 'autoescola',
  'psicólogo', 'psicologo', 'nutricionista', 'personal', 'fisioterapia',
]

function extrairIntencao(msg: string): { nicho: string | null; cidade: string | null } {
  const lower = msg.toLowerCase()
  let cidade: string | null = null
  let nicho: string | null = null

  for (const c of CIDADES) {
    if (lower.includes(c)) {
      cidade = c.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      break
    }
  }
  for (const n of NICHOS) {
    if (lower.includes(n)) {
      nicho = n.charAt(0).toUpperCase() + n.slice(1)
      break
    }
  }
  return { nicho, cidade }
}

const SYSTEM_PROMPT = `Você é o assistente de prospecção da NEW Agency, uma agência digital brasileira especializada em transformar negócios locais em marcas digitais profissionais.

Sua única função: ajudar o usuário a encontrar leads qualificados — negócios locais com alta demanda mas presença digital fraca (sem site, sem Instagram profissional, sem identidade visual).

Quando o usuário mencionar um nicho (ex: barbearia, salão, restaurante) E uma cidade brasileira na mesma mensagem, responda confirmando a busca de forma animada e direta.

Se perguntar sobre a NEW Agency: somos uma agência de design e marketing digital que cria sites profissionais, identidade visual e gestão de redes sociais para negócios locais que já têm demanda mas ainda não aparecem online. Site: newperfect.netlify.app

Regras:
- Fale português brasileiro informal e direto
- Respostas curtas (máximo 3 linhas)
- Sem markdown excessivo
- Se não entender, peça nicho + cidade`

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { message, history = [] } = body

  if (!message) {
    return NextResponse.json({ error: 'message obrigatório' }, { status: 400 })
  }

  const { nicho, cidade } = extrairIntencao(message)

  // Detectou nicho + cidade — dispara busca direto
  if (nicho && cidade && APIFY_TOKEN) {
    return NextResponse.json({
      type: 'search_trigger',
      message: `🔍 Buscando **${nicho}** em **${cidade}**...`,
      search: { nicho, cidade },
    })
  }

  // Sem Gemini key — resposta estática
  if (!GEMINI_KEY) {
    return NextResponse.json({
      type: 'message',
      message: gerarRespostaEstatica(message),
    })
  }

  // Chat via Gemini 2.5 Pro
  const contents = [
    ...history.slice(-8).map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ]

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.7,
        },
      }),
    }
  )

  if (!geminiRes.ok) {
    const err = await geminiRes.text()
    console.error('Gemini error:', err)
    return NextResponse.json({ type: 'message', message: gerarRespostaEstatica(message) })
  }

  const geminiData = await geminiRes.json()
  const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || gerarRespostaEstatica(message)

  // Tenta extrair intenção da resposta do Gemini
  const intencao = extrairIntencao(reply)

  return NextResponse.json({
    type: 'message',
    message: reply,
    search: intencao.nicho && intencao.cidade ? intencao : undefined,
  })
}

function gerarRespostaEstatica(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('oi') || lower.includes('olá') || lower.includes('ola') || lower.includes('boa') || lower.includes('ei')) {
    return `Oi! 👋 Sou o assistente da NEW Agency. Me fala o nicho e a cidade que você quer prospectar!\n\nExemplos:\n\u203a "Cabeleireiros em Arujá"\n\u203a "Restaurantes em Guarulhos"\n\u203a "Acadêmias em Mogi das Cruzes"`
  }
  if (lower.includes('new agency') || lower.includes('empresa') || lower.includes('vocês') || lower.includes('voces')) {
    return `A NEW Agency transforma negócios locais em marcas digitais. 🚀\n\nFazemos sites, identidade visual, Instagram e tráfego pago para quem já tem clientes mas não aparece online.\n\n🌐 newperfect.netlify.app`
  }
  return `Me diz o nicho e a cidade! Por exemplo:\n\u203a "Barbearias em Arujá"\n\u203a "Salões em São Paulo"\n\nVou buscar os leads qualificados pra você. 🎯`
}
