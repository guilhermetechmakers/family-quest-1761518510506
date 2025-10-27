import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface SkeletonFormProps {
  className?: string
  fields?: number
  showSubmit?: boolean
}

export function SkeletonForm({ 
  className, 
  fields = 4, 
  showSubmit = true 
}: SkeletonFormProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ))}
      {showSubmit && (
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-24 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
      )}
    </div>
  )
}