'use client'
import { cn } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  size?: 'sm' | 'md' | 'lg'
}

export function ScoreBadge({ score, size = 'md' }: ScoreBadgeProps) {
  const color =
    score >= 70 ? 'text-red-400 border-red-500/40 bg-red-500/10' :
    score >= 45 ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10' :
    'text-green-400 border-green-500/40 bg-green-500/10'

  const label =
    score >= 70 ? '🔥 Alta' :
    score >= 45 ? '⚡ Média' :
    '✓ Baixa'

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5 font-bold',
  }

  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold', color, sizes[size])}>
      <span>{score}</span>
      <span className="opacity-70">|</span>
      <span>{label}</span>
    </div>
  )
}
