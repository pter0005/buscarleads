'use client'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'

export interface Filters {
  busca: string
  semSite: boolean
  semInstagram: boolean
  scoreMin: number
  status: string
  cidade: string
}

interface LeadFiltersProps {
  filters: Filters
  onChange: (f: Filters) => void
  cidades: string[]
}

export function LeadFilters({ filters, onChange, cidades }: LeadFiltersProps) {
  const set = (key: keyof Filters, value: any) => onChange({ ...filters, [key]: value })

  return (
    <div className="bg-surface-card border border-surface-border rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nome, bairro..."
          value={filters.busca}
          onChange={e => set('busca', e.target.value)}
          className="w-full bg-surface-elevated border border-surface-border rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 transition-colors duration-200"
        />
      </div>

      {/* City */}
      <select
        value={filters.cidade}
        onChange={e => set('cidade', e.target.value)}
        className="bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand/50 transition-colors duration-200 cursor-pointer"
      >
        <option value="">Todas as cidades</option>
        {cidades.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Score Min */}
      <div className="flex items-center gap-2 text-sm">
        <SlidersHorizontal className="w-4 h-4 text-gray-500" />
        <span className="text-gray-500">Score mín:</span>
        <input
          type="number"
          min={0} max={100}
          value={filters.scoreMin}
          onChange={e => set('scoreMin', Number(e.target.value))}
          className="w-16 bg-surface-elevated border border-surface-border rounded-lg px-2 py-1.5 text-sm text-white text-center focus:outline-none focus:border-brand/50"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-2">
        <button
          onClick={() => set('semSite', !filters.semSite)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
            filters.semSite ? 'bg-brand/20 border-brand/40 text-brand' : 'bg-surface-elevated border-surface-border text-gray-400 hover:border-brand/30'
          }`}
        >
          Sem Site
        </button>
        <button
          onClick={() => set('semInstagram', !filters.semInstagram)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 cursor-pointer ${
            filters.semInstagram ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400' : 'bg-surface-elevated border-surface-border text-gray-400 hover:border-yellow-500/30'
          }`}
        >
          Sem Instagram
        </button>
      </div>

      {/* Status */}
      <select
        value={filters.status}
        onChange={e => set('status', e.target.value)}
        className="bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand/50 transition-colors duration-200 cursor-pointer"
      >
        <option value="">Todos os status</option>
        <option value="novo">Novo</option>
        <option value="contatado">Contatado</option>
        <option value="respondeu">Respondeu</option>
        <option value="reuniao">Reunião</option>
        <option value="fechado">Fechado</option>
        <option value="perdido">Perdido</option>
      </select>
    </div>
  )
}
