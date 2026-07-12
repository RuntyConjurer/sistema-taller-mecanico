import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function ErrorState({
  title = 'Algo salió mal',
  description = 'No pudimos cargar la información. Intenta de nuevo en unos momentos.',
  actionLabel = 'Reintentar',
  onAction,
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 px-6 py-16 text-center"
      role="alert"
    >
      <div className="mb-4 rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertTriangle className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      ) : null}
      {onAction ? (
        <Button className="mt-6" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}

export default ErrorState
