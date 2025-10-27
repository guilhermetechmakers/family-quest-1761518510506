import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonTableProps {
  className?: string
  rows?: number
  columns?: number
  showHeader?: boolean
}

export function SkeletonTable({ 
  className, 
  rows = 5, 
  columns = 4,
  showHeader = true 
}: SkeletonTableProps) {
  return (
    <div className={cn("w-full", className)}>
      {showHeader && (
        <div className="grid grid-cols-4 gap-4 p-4 border-b">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 p-4">
            {Array.from({ length: columns }).map((_, j) => (
              <Skeleton key={j} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}