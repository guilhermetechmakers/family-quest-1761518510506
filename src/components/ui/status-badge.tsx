import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: 'completed' | 'active' | 'paused' | 'draft' | 'cancelled'
  className?: string
}

const statusClasses = {
  completed: 'bg-mint-green text-text-primary',
  active: 'bg-light-pink text-text-primary',
  paused: 'bg-pastel-yellow text-text-primary',
  draft: 'bg-gray-200 text-text-secondary',
  cancelled: 'bg-red-100 text-red-800',
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold",
        statusClasses[status],
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}