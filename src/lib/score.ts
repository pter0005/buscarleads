import type { Lead, LeadScore } from '@/types/lead'

export function calcularScore(lead: Partial<Lead>): LeadScore {
  let presence = 0
  let contactability = 0
  let demand = 0
  let branding = 0
  const motivos: string[] = []

  // Presence
  if (!lead.site) { presence += 35; motivos.push('Sem site próprio') }
  if (!lead.instagram) { presence += 20; motivos.push('Sem Instagram') }
  else if (!lead.ig_profissional) { presence += 12; motivos.push('IG amador') }

  // Branding
  if (!lead.identidade_visual) { branding += 15; motivos.push('Sem identidade visual') }

  // Demand
  const rv = parseInt(String(lead.reviews ?? 0)) || 0
  if (rv > 30 && !lead.site) { demand += 18; motivos.push('🔥 Movimentado sem site') }
  if (rv > 50) { demand += 8; motivos.push('Alta demanda orgânica') }
  if (lead.avaliacao && lead.avaliacao >= 4.5 && !lead.site) { demand += 10; motivos.push('⭐ Alta avaliação sem presença') }

  // Contactability
  if (lead.whatsapp) { contactability += 10 }
  if (lead.telefone) { contactability += 5 }
  if (lead.email) { contactability += 5 }
  if (!lead.whatsapp && !lead.telefone) { motivos.push('Difícil de contatar') }

  const total = Math.min(presence + branding + demand + (20 - contactability < 0 ? 0 : 20 - contactability), 100)

  return {
    total: Math.min(presence + branding + demand, 100),
    presence: Math.min(presence, 55),
    contactability: Math.min(contactability, 20),
    demand: Math.min(demand, 36),
    branding: Math.min(branding, 15),
    motivos,
  }
}

export function gerarMensagemWhatsApp(lead: Lead): string {
  return [
    `✂️ *${lead.nome}*`,
    `📍 ${lead.endereco || lead.cidade}`,
    lead.bairro ? `🏘️ ${lead.bairro}` : '',
    lead.telefone ? `📞 ${lead.telefone}` : '📞 Sem telefone',
    lead.whatsapp ? `💬 ${lead.whatsapp}` : '',
    lead.email ? `📧 ${lead.email}` : '',
    lead.instagram ? `📸 ${lead.instagram}` : '📸 Sem Instagram',
    lead.site ? `🌐 ${lead.site}` : '🌐 *SEM SITE — OPORTUNIDADE!*',
    lead.avaliacao ? `⭐ ${lead.avaliacao} (${lead.reviews || 0} avaliações)` : '',
    lead.nome_dono ? `👤 ${lead.nome_dono}` : '',
    ``,
    `📊 Score SWAS: *${lead.score}/100*`,
    `🎯 ${lead.motivos?.join(' | ')}`,
  ].filter(Boolean).join('\n')
}

export function gerarAbordagem(lead: Lead): string {
  const primeiroMotivo = lead.motivos?.[0] || 'presença digital fraca'
  return `Oi! Vi que a ${lead.nome} tem ótima reputação (${lead.reviews || 0} avaliações) e quis entrar em contato. Notei que ${primeiroMotivo.toLowerCase()}, e isso pode estar custando clientes todos os dias. Tenho uma solução rápida que pode ajudar bastante — posso mostrar em menos de 5 minutos?`
}
