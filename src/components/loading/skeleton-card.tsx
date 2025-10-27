import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  className?: string
  showImage?: boolean
  showActions?: boolean
  lines?: number
}

export function SkeletonCard({ 
  className, 
  showImage = false, 
  showActions = false,
  lines = 3 
}: SkeletonCardProps) {
  return (
    <Card className={cn("animate-pulse", className)}>
      <CardHeader className="space-y-3">
        {showImage && (
          <Skeleton className="h-32 w-full rounded-xl" />
        )}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton 
            key={i} 
            className={cn(
              "h-3",
              i === lines - 1 ? "w-2/3" : "w-full"
            )} 
          />
        ))}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}