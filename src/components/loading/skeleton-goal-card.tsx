import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonGoalCardProps {
  className?: string
  showImage?: boolean
  showProgress?: boolean
  showContributors?: boolean
}

export function SkeletonGoalCard({ 
  className, 
  showImage = true, 
  showProgress = true,
  showContributors = true 
}: SkeletonGoalCardProps) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardHeader className="space-y-3">
        {showImage && (
          <Skeleton className="h-40 w-full rounded-xl" />
        )}
        <div className="space-y-2">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        )}
        {showContributors && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <div className="flex -space-x-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-background" />
              ))}
              <Skeleton className="h-8 w-8 rounded-full border-2 border-background" />
            </div>
          </div>
        )}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}