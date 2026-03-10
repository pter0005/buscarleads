export interface Lead {
  id: string
  nome: string
  nicho: string
  endereco?: string
  bairro?: string
  cidade: string
  estado: string
  telefone?: string
  whatsapp?: string
  email?: string
  instagram?: string
  ig_profissional?: boolean
  seguidores_ig?: string
  identidade_visual?: boolean
  site?: string
  avaliacao?: number
  reviews?: number
  horario?: string
  nome_dono?: string
  score: number
  motivos: string[]
  status: LeadStatus
  favoritado: boolean
  notas?: string
  createdAt: string
}

export type LeadStatus = 'novo' | 'contatado' | 'respondeu' | 'reuniao' | 'fechado' | 'perdido'

export interface LeadScore {
  total: number
  presence: number
  contactability: number
  demand: number
  branding: number
  motivos: string[]
}

export interface SearchRequest {
  nicho: string
  cidade: string
  estado?: string
  raio?: number
}

export interface SearchStats {
  total: number
  semSite: number
  semInstagram: number
  scoreAlto: number
  mediaSocre: number
}
