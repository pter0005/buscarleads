import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export function exportCSV(leads: any[], filename = 'leads-swas.csv') {
  const headers = ['Nome','Cidade','Bairro','Telefone','WhatsApp','Email','Instagram','Site','Avaliacao','Reviews','Score','Motivos','Status']
  const rows = leads.map(l => [
    l.nome, l.cidade, l.bairro||'', l.telefone||'', l.whatsapp||'', l.email||'',
    l.instagram||'', l.site||'', l.avaliacao||'', l.reviews||'',
    l.score, `"${l.motivos?.join(' | ')}"`, l.status
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
  a.download = filename
  a.click()
}

export const STATUS_LABELS: Record<string, string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  respondeu: 'Respondeu',
  reuniao: 'Reunião',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

export const STATUS_COLORS: Record<string, string> = {
  novo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  contatado: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  respondeu: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  reuniao: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  fechado: 'bg-green-500/20 text-green-400 border-green-500/30',
  perdido: 'bg-red-500/20 text-red-400 border-red-500/30',
}
