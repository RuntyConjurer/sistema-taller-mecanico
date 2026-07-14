import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WorkshopMedia from '@/components/common/WorkshopMedia'
import { useAsyncData } from '@/hooks/useAsyncData'
import { listarServicios } from '@/services/catalogoService'
import { formatCurrency } from '@/utils/formatters'

function ServiciosPublicos() {
  const [query, setQuery] = useState('')
  const { data: servicios } = useAsyncData(() => listarServicios(), [])
  // useMemo evita recalcular el filtro en cada render si no cambia la busqueda ni
  // cambia la lista de servicios.
  const filtered = useMemo(
    () =>
      (servicios || []).filter((service) =>
        `${service.nombre} ${service.descripcion} ${service.sintomas.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query, servicios],
  )
  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="page-container grid gap-8 py-16 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="eyebrow">Catálogo SGTRA</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Servicios guiados por el síntoma y la medición.
            </h1>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Selecciona lo que notas. Cada servicio explica qué revisamos antes de intervenir.
            </p>
          </div>
          <WorkshopMedia className="h-56" />
        </div>
      </section>
      <section className="public-section">
        <div className="page-container">
          <label className="relative block max-w-lg">
            <span className="sr-only">Filtrar servicios</span>
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-12 w-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Busca por síntoma o servicio"
            />
          </label>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {filtered.map((service, index) => (
              // Cada resultado conserva el mismo formato visual: numero, descripcion
              // y accion hacia el detalle individual.
              <article key={service.id} className="grid gap-5 py-7 md:grid-cols-[70px_1fr_auto]">
                <span className="technical-value text-primary">0{index + 1}</span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">{service.nombre}</h2>
                  <p className="mt-2 max-w-xl text-muted-foreground">{service.descripcion}</p>
                  <p className="mt-4 text-sm">
                    <b>Señales:</b> {service.sintomas.join(' · ')}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span className="technical-value">{service.duracion}</span>
                  <span className="font-semibold">Desde {formatCurrency(service.precioBase)}</span>
                  <Button variant="outline" asChild>
                    <Link to={`/servicios/${service.slug}`}>
                      Ver proceso <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="py-10 text-muted-foreground">
              No encontramos un servicio con ese término. Puedes solicitar un diagnóstico general.
            </p>
          ) : null}
        </div>
      </section>
    </>
  )
}

export default ServiciosPublicos
