import { Link, useParams } from 'react-router-dom'
import { MapPin, MessageCircle, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmptyState from '@/components/common/EmptyState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import WorkshopMedia from '@/components/common/WorkshopMedia'
import { useAsyncData } from '@/hooks/useAsyncData'
import { obtenerSucursal } from '@/services/catalogoService'

function Sucursal() {
  const { branchId } = useParams()
  const { data: branch, isLoading } = useAsyncData(() => obtenerSucursal(branchId), [branchId])

  if (isLoading) {
    return (
      <section className="public-section">
        <div className="page-container">
          <LoadingSkeleton />
        </div>
      </section>
    )
  }

  // Antes, una sucursal inexistente mostraba la primera de la lista sin avisar.
  if (!branch) {
    return (
      <section className="public-section">
        <div className="page-container">
          <EmptyState
            title="Esa sucursal no existe"
            description="Revisa el enlace o consulta las sucursales disponibles desde el inicio."
          />
        </div>
      </section>
    )
  }

  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="page-container py-14">
          <p className="eyebrow">Sucursal SGTRA</p>
          <h1 className="mt-3 text-4xl font-bold">{branch.name}</h1>
          <p className="mt-3 text-muted-foreground">{branch.city}</p>
        </div>
      </section>
      <section className="public-section">
        <div className="page-container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="font-display text-2xl font-semibold">Visítanos</h2>
            <address className="mt-5 not-italic">
              <p className="flex gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-primary" />
                {branch.address}
              </p>
              <p className="mt-4 text-sm text-muted-foreground">{branch.schedule}</p>
            </address>
            <div className="mt-7 flex flex-wrap gap-5">
              <Button asChild>
                <Link to="/agendar-cita">Reservar turno</Link>
              </Button>
              <a
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                href="tel:+18095550142"
              >
                <Phone className="h-4 w-4" />
                Llamar
              </a>
              <a
                className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary"
                href="https://wa.me/18095550142"
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
            <h2 className="mt-12 font-display text-xl font-semibold">Equipo de la sede</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {branch.technicians.map((tech) => (
                <li key={tech} className="py-4 text-sm">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="photo-grid flex h-72 items-center justify-center border border-border bg-muted">
              <MapPin className="h-8 w-8 text-primary" />
              <span className="sr-only">Ubicación de referencia de la sucursal</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <WorkshopMedia className="h-24" />
              <WorkshopMedia className="h-24" />
              <WorkshopMedia className="h-24" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Sucursal
