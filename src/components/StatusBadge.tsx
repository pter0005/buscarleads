'use client'
import { cn, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import type { LeadStatus } from '@/types/lead'

interface StatusBadgeProps {
  status: LeadStatus
  onClick?: () => void
}

export function StatusBadge({ status, onClick }: StatusBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all duration-200',
        STATUS_COLORS[status],
        onClick && 'cursor-pointer hover:opacity-80'
      )}
    >
      {STATUS_LABELS[status]}
    </button>
  )
}
