import type { Lead } from '@/types/lead'
import { calcularScore } from './score'

const rawLeads = [
  { nome: 'Barbearia do Zé', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Centro', telefone: '(11) 99999-0001', whatsapp: '(11) 99999-0001', avaliacao: 4.8, reviews: 87, horario: 'Seg-Sáb 9h-19h', nome_dono: 'José Silva' },
  { nome: 'Kings Barber Shop', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Jardim das Flores', telefone: '(11) 99999-0002', instagram: 'https://instagram.com/kingsbarber', avaliacao: 4.6, reviews: 54, site: 'https://kingsbarber.com.br', horario: 'Ter-Dom 10h-20h' },
  { nome: 'Old School Barber', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Vila Nova', telefone: '(11) 99999-0003', avaliacao: 4.9, reviews: 132, horario: 'Seg-Sáb 8h-18h', nome_dono: 'Marco Antônio' },
  { nome: 'Navalha & Style', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Parque Industrial', whatsapp: '(11) 99999-0004', email: 'navalha@gmail.com', instagram: 'https://instagram.com/navalhaestyle', avaliacao: 4.3, reviews: 28 },
  { nome: 'Prime Cuts Barber', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Centro', telefone: '(11) 99999-0005', avaliacao: 4.7, reviews: 95, nome_dono: 'Bruno Lima' },
  { nome: 'BarberKing Arujá', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Jardim Primavera', whatsapp: '(11) 99999-0006', instagram: 'https://instagram.com/barberking', ig_profissional: true, avaliacao: 4.5, reviews: 61, identidade_visual: true },
  { nome: 'Corte & Estilo', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Vila Maria', telefone: '(11) 99999-0007', avaliacao: 4.1, reviews: 19 },
  { nome: 'Senhor Barber', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Bela Vista', telefone: '(11) 99999-0008', whatsapp: '(11) 99999-0008', avaliacao: 4.8, reviews: 203, nome_dono: 'Roberto Santos', horario: 'Seg-Dom 9h-21h' },
  { nome: 'Vintage Barber House', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Residencial Park', email: 'vintage@gmail.com', instagram: 'https://instagram.com/vintagebarber', avaliacao: 4.4, reviews: 44, site: 'https://vintagebarber.com.br', ig_profissional: true, identidade_visual: true },
  { nome: 'Naifa Barber Co.', nicho: 'barbearia', cidade: 'Arujá', estado: 'SP', bairro: 'Centro', telefone: '(11) 99999-0010', avaliacao: 4.9, reviews: 167, nome_dono: 'Felipe Naifa', horario: 'Ter-Dom 9h-20h' },
]

export const MOCK_LEADS: Lead[] = rawLeads.map((raw, i) => {
  const scored = calcularScore(raw)
  return {
    ...raw,
    id: `lead-${i + 1}`,
    score: scored.total,
    motivos: scored.motivos,
    status: 'novo',
    favoritado: false,
    createdAt: new Date().toISOString(),
  } as Lead
}).sort((a, b) => b.score - a.score)
