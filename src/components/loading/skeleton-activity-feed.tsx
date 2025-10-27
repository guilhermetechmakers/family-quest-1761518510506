import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonActivityFeedProps {
  className?: string
  count?: number
  showMedia?: boolean
}

export function SkeletonActivityFeed({ 
  className, 
  count = 5, 
  showMedia = false 
}: SkeletonActivityFeedProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex space-x-3">
              <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                {showMedia && (
                  <Skeleton className="h-32 w-full rounded-lg mt-2" />
                )}
                <div className="flex items-center space-x-4 pt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-12 rounded-full" />
                  <Skeleton className="h-6 w-14 rounded-full" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}