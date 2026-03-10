'use client'
import { useState } from 'react'
import { Search, Loader2, Zap, MapPin } from 'lucide-react'

const NICHOS_SUGERIDOS = [
  'Barbearia', 'Salão de Beleza', 'Restaurante', 'Pizzaria', 'Academia',
  'Pet Shop', 'Farmácia', 'Dentista', 'Mecânica', 'Padaria',
  'Estética', 'Hotel', 'Escola', 'Loja', 'Imobiliária',
]

const CIDADES_SUGERIDAS = [
  'Arujá', 'Mogi das Cruzes', 'Guarulhos', 'São Paulo', 'Campinas',
  'Santo André', 'São Bernardo', 'Osasco', 'Suzano', 'Itaquaquecetuba',
]

interface SearchFormProps {
  onSearch: (nicho: string, cidade: string) => void
  loading: boolean
}

export function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [nicho, setNicho] = useState('')
  const [cidade, setCidade] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nicho.trim() || !cidade.trim()) return
    onSearch(nicho.trim(), cidade.trim())
  }

  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded-lg bg-brand/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-brand" />
        </div>
        <h2 className="text-sm font-semibold text-white">Buscar Leads com IA</h2>
        <span className="text-xs text-gray-600 font-mono">powered by Google Maps</span>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Nicho (ex: barbearia, restaurante...)"
            value={nicho}
            onChange={e => setNicho(e.target.value)}
            list="nichos-list"
            className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 transition-colors duration-200"
          />
          <datalist id="nichos-list">
            {NICHOS_SUGERIDOS.map(n => <option key={n} value={n} />)}
          </datalist>
        </div>

        <div className="flex-1 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Cidade (ex: Arujá, Guarulhos...)"
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            list="cidades-list"
            className="w-full bg-surface-elevated border border-surface-border rounded-xl pl-9 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand/50 transition-colors duration-200"
          />
          <datalist id="cidades-list">
            {CIDADES_SUGERIDAS.map(c => <option key={c} value={c} />)}
          </datalist>
        </div>

        <button
          type="submit"
          disabled={loading || !nicho.trim() || !cidade.trim()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-brand text-surface font-bold text-sm rounded-xl hover:bg-brand-dim transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</>
          ) : (
            <><Zap className="w-4 h-4" /> Buscar Leads</>
          )}
        </button>
      </form>

      {/* Tags rápidos */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {NICHOS_SUGERIDOS.slice(0, 8).map(n => (
          <button
            key={n}
            onClick={() => setNicho(n)}
            className="text-xs px-2.5 py-1 rounded-full bg-surface-elevated border border-surface-border text-gray-500 hover:border-brand/30 hover:text-brand transition-all duration-200 cursor-pointer"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}
