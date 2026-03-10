'use client'
import { useState, useMemo, useCallback } from 'react'
import { MOCK_LEADS } from '@/lib/mock-leads'
import type { Lead } from '@/types/lead'
import { StatsHeader } from '@/components/StatsHeader'
import { LeadFilters, type Filters } from '@/components/LeadFilters'
import { LeadCard } from '@/components/LeadCard'
import { LeadDrawer } from '@/components/LeadDrawer'
import { SearchForm } from '@/components/SearchForm'
import { exportCSV } from '@/lib/utils'
import { Download, Zap, Star, RefreshCw, Sparkles, Globe } from 'lucide-react'

export default function HomePage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [selected, setSelected] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchMeta, setSearchMeta] = useState<{ nicho: string; cidade: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
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

  const updateLead = useCallback((id: string, changes: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...changes } : l))
    setSelected(prev => prev?.id === id ? { ...prev, ...changes } : prev)
  }, [])

  const handleSearch = useCallback(async (nicho: string, cidade: string) => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nicho, cidade }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro na busca')
      setLeads(data.leads)
      setSearchMeta({ nicho, cidade })
      setFilters({ busca: '', semSite: false, semInstagram: false, scoreMin: 0, status: '', cidade: '' })
    } catch (e: any) {
      setErrorMsg(e.message || 'Erro inesperado')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleReset = useCallback(() => {
    setLeads(MOCK_LEADS)
    setSearchMeta(null)
    setErrorMsg(null)
    setFilters({ busca: '', semSite: false, semInstagram: false, scoreMin: 0, status: '', cidade: '' })
  }, [])

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
            <a
              href="https://newperfect.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-surface-border bg-surface-card text-gray-400 hover:border-brand/30 hover:text-brand transition-all duration-200 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              NEW Agency
            </a>
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse-dot" />
            <span className="text-xs text-brand font-mono font-semibold tracking-widest uppercase">Sistema ativo</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-1">
            Inteligência de <span className="text-brand">Leads</span>
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl">
            Busque qualquer nicho em qualquer cidade e encontre negócios com alta demanda mas presença digital fraca.
            Score SWAS identifica automaticamente as melhores oportunidades.
          </p>
        </div>

        {/* Search */}
        <SearchForm onSearch={handleSearch} loading={loading} />

        {/* Search meta */}
        {searchMeta && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs text-brand bg-brand/10 border border-brand/20 px-3 py-1.5 rounded-full">
              <Sparkles className="w-3 h-3" />
              Resultado: <strong>{searchMeta.nicho}</strong> em <strong>{searchMeta.cidade}</strong>
            </div>
            <button onClick={handleReset} className="text-xs text-gray-500 hover:text-white transition-colors cursor-pointer underline">
              Usar dados de exemplo
            </button>
          </div>
        )}

        {/* Error */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            ⚠️ {errorMsg} — Verifique sua API Key no <code>.env.local</code>
          </div>
        )}

        <StatsHeader leads={leads} />
        <LeadFilters filters={filters} onChange={setFilters} cidades={cidades} />

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
            <p className="text-gray-500 text-sm">Nenhum lead encontrado.</p>
            <button onClick={handleReset} className="mt-3 text-xs text-brand hover:underline cursor-pointer">Voltar ao início</button>
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

      {/* NEW Agency Banner */}
      <div className="border-t border-surface-border bg-surface-card mt-16">
        <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-brand flex items-center justify-center">
                <Zap className="w-3 h-3 text-surface" />
              </div>
              <span className="text-xs font-bold text-brand tracking-widest uppercase">NEW Agency</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Transformamos negócios locais em <span className="text-brand">marcas digitais</span></h2>
            <p className="text-sm text-gray-500 max-w-lg">
              Sites profissionais, identidade visual, tráfego pago e presença digital completa para negócios que já têm demanda mas ainda não aparecem online.
              Os leads que você encontrou aqui são os nossos clientes ideais.
            </p>
          </div>
          <div className="flex flex-col gap-2 shrink-0">
            <a
              href="https://newperfect.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-brand text-surface font-bold text-sm rounded-xl hover:bg-brand-dim transition-all duration-200 cursor-pointer"
            >
              <Globe className="w-4 h-4" />
              Ver portfólio
            </a>
            <p className="text-xs text-center text-gray-600">newperfect.netlify.app</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-surface-border py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-brand flex items-center justify-center">
              <Zap className="w-3 h-3 text-surface" />
            </div>
            <span className="text-xs text-gray-600 font-mono">SWAS LEADS — powered by NEW Agency</span>
          </div>
          <span className="text-xs text-gray-700">© 2026</span>
        </div>
      </footer>

      <LeadDrawer lead={selected} onClose={() => setSelected(null)} onUpdate={updateLead} />
    </div>
  )
}
