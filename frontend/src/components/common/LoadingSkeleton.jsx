import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

function LoadingSkeleton({ rows = 4, className }) {
  return (
    <div className={cn('space-y-3', className)} aria-busy="true" aria-label="Cargando contenido">
      <Skeleton className="h-8 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}

export default LoadingSkeleton
