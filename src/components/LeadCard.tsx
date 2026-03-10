'use client'
import { Star, Globe, Instagram, MessageCircle, Phone } from 'lucide-react'
import type { Lead } from '@/types/lead'
import { ScoreBadge } from './ScoreBadge'
import { StatusBadge } from './StatusBadge'
import { cn } from '@/lib/utils'

interface LeadCardProps {
  lead: Lead
  onClick: () => void
  onFavorite: () => void
  onStatusChange: (s: any) => void
}

export function LeadCard({ lead, onClick, onFavorite, onStatusChange }: LeadCardProps) {
  const urgency = lead.score >= 70

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-surface-card border rounded-xl p-4 cursor-pointer transition-all duration-200 hover:border-brand/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5 group',
        urgency ? 'border-red-500/30' : 'border-surface-border'
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-brand transition-colors duration-200">{lead.nome}</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{lead.bairro ? `${lead.bairro} · ` : ''}{lead.cidade}</p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onFavorite() }}
            className="p-1 rounded hover:bg-surface-elevated transition-colors cursor-pointer"
          >
            <Star className={`w-3.5 h-3.5 ${lead.favoritado ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
          </button>
          <ScoreBadge score={lead.score} size="sm" />
        </div>
      </div>

      {/* Motivos */}
      <div className="flex flex-wrap gap-1 mb-3">
        {lead.motivos.slice(0, 2).map((m, i) => (
          <span key={i} className="text-xs px-1.5 py-0.5 rounded bg-brand/10 text-brand/80 border border-brand/10">{m}</span>
        ))}
        {lead.motivos.length > 2 && (
          <span className="text-xs px-1.5 py-0.5 rounded bg-surface-elevated text-gray-500">+{lead.motivos.length - 2}</span>
        )}
      </div>

      {/* Indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${lead.site ? 'bg-gray-600' : 'bg-brand animate-pulse-dot'}`} title={lead.site ? 'Tem site' : 'Sem site'} />
          <span className={`w-2 h-2 rounded-full ${lead.instagram ? 'bg-gray-600' : 'bg-yellow-400 animate-pulse-dot'}`} title={lead.instagram ? 'Tem Instagram' : 'Sem Instagram'} />
          {lead.whatsapp && <MessageCircle className="w-3 h-3 text-green-500" />}
          {lead.telefone && <Phone className="w-3 h-3 text-blue-400" />}
          {lead.avaliacao && (
            <span className="text-xs text-gray-500">⭐ {lead.avaliacao} ({lead.reviews})</span>
          )}
        </div>
        <div onClick={e => e.stopPropagation()}>
          <StatusBadge status={lead.status} onClick={() => {
            const order: any[] = ['novo','contatado','respondeu','reuniao','fechado']
            const next = order[(order.indexOf(lead.status) + 1) % order.length]
            onStatusChange(next)
          }} />
        </div>
      </div>
    </div>
  )
}
