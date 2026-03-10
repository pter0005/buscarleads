'use client'
import { useState, useMemo } from 'react'
import { MOCK_LEADS } from '@/lib/mock-leads'
import type { Lead } from '@/types/lead'
import { StatsHeader } from '@/components/StatsHeader'
import { LeadFilters, type Filters } from '@/components/LeadFilters'
import { LeadCard } from '@/components/LeadCard'
import { LeadDrawer } from '@/components/LeadDrawer'
import { exportCSV } from '@/lib/utils'
import { Download, Zap, Star, RefreshCw } from 'lucide-react'

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [filters, setFilters] = useState<Filters>({
    busca: '', semSite: false, semInstagram: false, scoreMin: 0, status: '', cidade: ''
  })
  const [showFav, setShowFav] = useState(false)

  const cidades = useMemo(() => [...new Set(leads.map(l => l.cidade))], [leads])

  const filtered = useMemo(() => {
    return leads.filter(l => {
      if (showFav && !l.favoritado) return false
      if (filters.busca && !`${l.nome} ${l.bairro} ${l.cidade}`.toLowerCase().includes(filters.busca.toLowerCase())) return false
      if (filters.semSite && l.site) return false
      if (filters.semInstagram && l.instagram) return false
      if (filters.scoreMin > 0 && l.score < filters.scoreMin) return false
      if (filters.status && l.status !== filters.status) return false
      if (filters.cidade && l.cidade !== filters.cidade) return false
      return true
    })
  }, [leads, filters, showFav])

  const updateLead = (id: string, changes: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...changes } : l))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, ...changes } : null)
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-surface" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">SWAS</span>
            <span className="text-xs text-gray-600 font-mono">LEADS</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFav(!showFav)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
                showFav ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-surface-card border-surface-border text-gray-400 hover:border-yellow-500/30'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Favoritos
            </button>
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-surface-border bg-surface-card text-gray-400 hover:border-brand/30 hover:text-brand transition-all duration-200 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot" />
            <span className="text-xs text-brand font-mono font-semibold tracking-widest uppercase">Sistema ativo</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Inteligência de <span className="text-brand">Leads</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Negócios locais com alta demanda e presença digital fraca — oportunidades reais para sua prospecção.
          </p>
        </div>

        <StatsHeader leads={leads} />
        <LeadFilters filters={filters} onChange={setFilters} cidades={cidades} />

        {/* Count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500">
            <span className="text-white font-semibold">{filtered.length}</span> leads encontrados
          </span>
          <button
            onClick={() => setFilters({ busca: '', semSite: false, semInstagram: false, scoreMin: 0, status: '', cidade: '' })}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            Limpar filtros
          </button>
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-xl bg-surface-card border border-surface-border flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-gray-500 text-sm">Nenhum lead encontrado com esses filtros.</p>
            <button onClick={() => setFilters({ busca: '', semSite: false, semInstagram: false, scoreMin: 0, status: '', cidade: '' })} className="mt-3 text-xs text-brand hover:underline cursor-pointer">Limpar filtros</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onClick={() => setSelected(lead)}
                onFavorite={() => updateLead(lead.id, { favoritado: !lead.favoritado })}
                onStatusChange={s => updateLead(lead.id, { status: s })}
              />
            ))}
          </div>
        )}
      </main>

      <LeadDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onUpdate={updateLead}
      />
    </div>
  )
}
