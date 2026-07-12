import workshopImage from '@/assets/sgtra-workshop.webp'
import { cn } from '@/lib/utils'

function WorkshopMedia({ alt = 'Técnico revisando el aire acondicionado de un vehículo', className, priority = false }) {
  return (
    <figure className={cn('relative overflow-hidden border border-border bg-muted', className)}>
      <img src={workshopImage} alt={alt} width="1376" height="768" className="h-full w-full object-cover" loading={priority ? 'eager' : 'lazy'} />
    </figure>
  )
}

export default WorkshopMedia
