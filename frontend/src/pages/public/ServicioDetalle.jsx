import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/common/EmptyState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import WorkshopMedia from '@/components/common/WorkshopMedia'
import { useAsyncData } from '@/hooks/useAsyncData'
import { obtenerServicio } from '@/services/catalogoService'

function ServicioDetalle() {
  const { serviceId } = useParams()
  const { data: service, isLoading } = useAsyncData(() => obtenerServicio(serviceId), [serviceId])

  if (isLoading) {
    return (
      <section className="public-section">
        <div className="page-container">
          <LoadingSkeleton />
        </div>
      </section>
    )
  }

  // Antes, un servicio inexistente mostraba el primero de la lista sin avisar.
  if (!service) {
    return (
      <section className="public-section">
        <div className="page-container">
          <EmptyState
            title="Ese servicio no existe"
            description="Puede que el enlace esté mal escrito o que ya no ofrezcamos ese servicio."
            actionLabel="Ver todos los servicios"
            onAction={() => window.location.assign('/servicios')}
          />
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="page-container grid gap-8 py-12 lg:grid-cols-[1fr_0.9fr]">
          <div className="self-center">
            <Link to="/servicios" className="text-sm font-semibold text-primary">
              ← Servicios
            </Link>
            <p className="eyebrow mt-8">Servicio especializado</p>
            <h1 className="mt-3 text-4xl font-bold">{service.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{service.short}</p>
          </div>
          <WorkshopMedia className="h-72" />
        </div>
      </section>
      <section className="public-section">
        <div className="page-container grid gap-12 lg:grid-cols-[1fr_340px]">
          <div>
            <h2 className="font-display text-2xl font-semibold">Qué revisamos</h2>
            <ol className="mt-6 divide-y divide-border border-y border-border">
              {service.process.map((item, index) => (
                <li key={item} className="flex gap-5 py-5">
                  <span className="technical-value text-primary">0{index + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
            <h2 className="mt-12 font-display text-2xl font-semibold">Preguntas frecuentes</h2>
            <details className="mt-5 border-y border-border py-5">
              <summary className="cursor-pointer font-semibold">¿Qué debo esperar?</summary>
              <p className="mt-3 text-muted-foreground">{service.faq}</p>
            </details>
            <details className="border-b border-border py-5">
              <summary className="cursor-pointer font-semibold">¿El precio es definitivo?</summary>
              <p className="mt-3 text-muted-foreground">
                El precio mostrado es una referencia demostrativa. Confirmamos el alcance después de
                evaluar el vehículo.
              </p>
            </details>
          </div>
          <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-24">
            <p className="eyebrow">Reserva</p>
            <p className="mt-3 font-display text-2xl font-semibold">{service.price}</p>
            <p className="mt-1 technical-value text-muted-foreground">{service.duration}</p>
            <Button className="mt-6 w-full" asChild>
              <Link to={`/agendar-cita?servicio=${service.id}`}>
                Agendar este servicio <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <a
              className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-primary"
              href="tel:+18095550142"
            >
              <Phone className="h-4 w-4" />
              Llamar al taller
            </a>
            <p className="mt-5 text-xs text-muted-foreground">
              <Check className="mr-1 inline h-3 w-3 text-success" />
              Valores de demostración, sin pago ni reserva real.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}

export default ServicioDetalle
