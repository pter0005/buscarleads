'use client'
import type { Lead } from '@/types/lead'

interface StatsHeaderProps {
  leads: Lead[]
}

export function StatsHeader({ leads }: StatsHeaderProps) {
  const total = leads.length
  const semSite = leads.filter(l => !l.site).length
  const semIG = leads.filter(l => !l.instagram).length
  const scoreAlto = leads.filter(l => l.score >= 70).length
  const media = total > 0 ? Math.round(leads.reduce((s, l) => s + l.score, 0) / total) : 0

  const stats = [
    { label: 'Total de Leads', value: total, icon: '📋', color: 'text-white' },
    { label: 'Sem Site', value: semSite, icon: '🌐', color: 'text-brand' },
    { label: 'Sem Instagram', value: semIG, icon: '📸', color: 'text-yellow-400' },
    { label: 'Score Alto', value: scoreAlto, icon: '🔥', color: 'text-red-400' },
    { label: 'Score Médio', value: `${media}/100`, icon: '📊', color: 'text-purple-400' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
      {stats.map(stat => (
        <div key={stat.label} className="bg-surface-card border border-surface-border rounded-xl p-4 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{stat.icon}</span>
            <span className="text-xs text-gray-500 font-medium">{stat.label}</span>
          </div>
          <span className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</span>
        </div>
      ))}
    </div>
  )
}
