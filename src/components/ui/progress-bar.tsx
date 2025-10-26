import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  className?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'mint' | 'lavender' | 'pink' | 'yellow'
}

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
}

const colorClasses = {
  mint: 'bg-mint-green',
  lavender: 'bg-pale-lavender',
  pink: 'bg-light-pink',
  yellow: 'bg-pastel-yellow',
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showPercentage = true,
  size = 'md',
  color = 'mint',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-sm text-text-secondary mb-2">
        <span>{value.toLocaleString()}</span>
        <span>{max.toLocaleString()}</span>
        {showPercentage && (
          <span className="font-semibold">{percentage.toFixed(1)}%</span>
        )}
      </div>
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}