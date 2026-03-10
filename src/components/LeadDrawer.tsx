'use client'
import { useState } from 'react'
import { X, Copy, MessageCircle, Star, ExternalLink, MapPin, Phone, Mail, Globe, Instagram, Clock, User, CheckCircle } from 'lucide-react'
import type { Lead, LeadStatus } from '@/types/lead'
import { ScoreBadge } from './ScoreBadge'
import { StatusBadge } from './StatusBadge'
import { copyToClipboard } from '@/lib/utils'
import { gerarMensagemWhatsApp, gerarAbordagem } from '@/lib/score'

interface LeadDrawerProps {
  lead: Lead | null
  onClose: () => void
  onUpdate: (id: string, changes: Partial<Lead>) => void
}

export function LeadDrawer({ lead, onClose, onUpdate }: LeadDrawerProps) {
  const [copied, setCopied] = useState<string | null>(null)

  if (!lead) return null

  const handleCopy = (text: string, key: string) => {
    copyToClipboard(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const nextStatus: Record<LeadStatus, LeadStatus> = {
    novo: 'contatado', contatado: 'respondeu', respondeu: 'reuniao', reuniao: 'fechado', fechado: 'fechado', perdido: 'perdido'
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-surface-card border-l border-surface-border z-50 flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-surface-border">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">{lead.nome}</h2>
            <p className="text-sm text-gray-500 mt-0.5">{lead.bairro ? `${lead.bairro}, ` : ''}{lead.cidade} — {lead.nicho}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onUpdate(lead.id, { favoritado: !lead.favoritado })} className="p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer">
              <Star className={`w-4 h-4 ${lead.favoritado ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-surface-elevated transition-colors cursor-pointer">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Score */}
          <div className="bg-surface-elevated rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-300">Score SWAS</span>
              <ScoreBadge score={lead.score} size="lg" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {lead.motivos.map((m, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">{m}</span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="bg-surface-elevated rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-300 mb-3">Status do Lead</p>
            <div className="flex flex-wrap gap-2">
              {(['novo','contatado','respondeu','reuniao','fechado','perdido'] as LeadStatus[]).map(s => (
                <button key={s} onClick={() => onUpdate(lead.id, { status: s })} className="cursor-pointer">
                  <StatusBadge status={s} />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-surface-elevated rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-300 mb-3">Contato</p>
            {lead.nome_dono && <Row icon={<User className="w-4 h-4" />} label="Proprietário" value={lead.nome_dono} />}
            {lead.telefone && <Row icon={<Phone className="w-4 h-4" />} label="Telefone" value={lead.telefone} copyable onCopy={() => handleCopy(lead.telefone!, 'tel')} copied={copied === 'tel'} />}
            {lead.whatsapp && <Row icon={<MessageCircle className="w-4 h-4" />} label="WhatsApp" value={lead.whatsapp} copyable onCopy={() => handleCopy(lead.whatsapp!, 'wa')} copied={copied === 'wa'} />}
            {lead.email && <Row icon={<Mail className="w-4 h-4" />} label="Email" value={lead.email} copyable onCopy={() => handleCopy(lead.email!, 'email')} copied={copied === 'email'} />}
            {lead.instagram && <Row icon={<Instagram className="w-4 h-4" />} label="Instagram" value={lead.instagram} link={lead.instagram} />}
            {lead.site && <Row icon={<Globe className="w-4 h-4" />} label="Site" value={lead.site} link={lead.site} />}
            {lead.horario && <Row icon={<Clock className="w-4 h-4" />} label="Horário" value={lead.horario} />}
            {lead.avaliacao && <Row icon={<Star className="w-4 h-4" />} label="Avaliação" value={`${lead.avaliacao}⭐ (${lead.reviews || 0} reviews)`} />}
          </div>

          {/* Abordagem Sugerida */}
          <div className="bg-surface-elevated rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-300 mb-2">Abordagem Sugerida</p>
            <p className="text-sm text-gray-400 leading-relaxed">{gerarAbordagem(lead)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-surface-border grid grid-cols-2 gap-3">
          <button
            onClick={() => handleCopy(gerarMensagemWhatsApp(lead), 'wa-full')}
            className="flex items-center justify-center gap-2 bg-brand/10 hover:bg-brand/20 border border-brand/30 text-brand rounded-xl py-3 text-sm font-semibold transition-all duration-200 cursor-pointer"
          >
            {copied === 'wa-full' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied === 'wa-full' ? 'Copiado!' : 'Copiar WhatsApp'}
          </button>
          {lead.whatsapp && (
            <a
              href={`https://wa.me/55${lead.whatsapp.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 rounded-xl py-3 text-sm font-semibold transition-all duration-200 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Abrir WhatsApp
            </a>
          )}
        </div>
      </div>
    </>
  )
}

function Row({ icon, label, value, copyable, onCopy, copied, link }: any) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex items-center gap-2 text-gray-500 min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="text-xs text-gray-600">{label}</span>
        <span className="text-sm text-gray-300 truncate">{value}</span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {copyable && (
          <button onClick={onCopy} className="p-1 rounded hover:bg-surface-card transition-colors cursor-pointer">
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-brand" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
          </button>
        )}
        {link && (
          <a href={link} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-surface-card transition-colors cursor-pointer">
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </a>
        )}
      </div>
    </div>
  )
}
