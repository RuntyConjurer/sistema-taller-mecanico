import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

function NotFound() {
  return (
    <section className="section-padding">
      <div className="page-container max-w-xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Error 404</p>
        <h1 className="mt-3 text-4xl font-bold">Esta página no está disponible.</h1>
        <p className="mt-4 text-muted-foreground">
          Puede que la dirección haya cambiado o que el enlace ya no exista.
        </p>
        <Button className="mt-7" asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </section>
  )
}

export default NotFound
