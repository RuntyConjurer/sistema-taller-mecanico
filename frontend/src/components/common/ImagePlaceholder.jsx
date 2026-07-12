import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const ratioClasses = {
  '16/9': 'aspect-video',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
  '3/4': 'aspect-[3/4]',
}

function ImagePlaceholder({ label = 'Imagen', ratio = '16/9', className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/60 text-muted-foreground',
        ratioClasses[ratio],
        className,
      )}
      role="img"
      aria-label={label}
    >
      <ImageIcon className="mb-2 h-8 w-8 opacity-60" aria-hidden="true" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  )
}

export default ImagePlaceholder
