import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonListProps {
  className?: string
  count?: number
  showAvatar?: boolean
  showActions?: boolean
}

export function SkeletonList({ 
  className, 
  count = 5, 
  showAvatar = false,
  showActions = false 
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 p-4">
          {showAvatar && (
            <Skeleton className="h-10 w-10 rounded-full" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            {showActions && (
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-12 rounded-full" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}