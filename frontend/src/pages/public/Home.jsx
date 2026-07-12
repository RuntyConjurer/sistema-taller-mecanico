import { Link } from 'react-router-dom'
import { ArrowRight, Gauge, MapPin, ThermometerSnowflake, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import WorkshopMedia from '@/components/common/WorkshopMedia'
import { useAsyncData } from '@/hooks/useAsyncData'
import { listarServicios, listarSucursales } from '@/services/catalogoService'
// Texto de la web, no un dato del taller: nunca saldrá de PostgreSQL.
import { sintomasFrecuentes } from '@/data/mocks/contenidoWeb.mock'

const symptomIcons = [ThermometerSnowflake, Gauge, Wrench, ThermometerSnowflake]

function Home() {
  const { data: servicios } = useAsyncData(() => listarServicios(), [])
  const { data: sucursales } = useAsyncData(() => listarSucursales(), [])

  return (
    <>
      <section className="border-b border-border bg-muted">
        <div className="page-container grid min-h-[620px] items-center gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow">Climatización automotriz</p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.035em] md:text-6xl">
              Revisamos el aire acondicionado de tu vehículo.
            </h1>
            <p className="mt-5 max-w-[58ch] text-lg leading-8 text-muted-foreground">
              Encuentra el servicio adecuado, agenda una revisión y recibe una explicación antes de
              reparar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link to="/agendar-cita">
                  Agendar revisión <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/servicios">Buscar un servicio</Link>
              </Button>
            </div>
          </div>
          <div className="lg:self-stretch">
            <WorkshopMedia priority className="h-[420px] md:h-[520px]" />
          </div>
        </div>
      </section>

      <section className="public-section">
        <div className="page-container">
          <div className="max-w-xl">
            <p className="eyebrow">Síntomas frecuentes</p>
            <h2 className="mt-3 text-3xl font-bold">Cuéntanos lo que notas, empezamos por ahí.</h2>
          </div>
          <div className="mt-10 grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-4">
            {sintomasFrecuentes.map((symptom, index) => {
              const Icon = symptomIcons[index]
              return (
                <Link
                  key={symptom.label}
                  to="/agendar-cita"
                  className="group border-b border-r border-border p-5 transition-colors hover:bg-muted"
                >
                  <Icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-10 font-display text-xl font-semibold">{symptom.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{symptom.note}</p>
                  <span className="mt-5 inline-block text-sm font-semibold text-primary">
                    Solicitar diagnóstico →
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-foreground text-white">
        <div className="page-container grid gap-10 py-16 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <p className="eyebrow text-accent">Cómo trabajamos</p>
            <h2 className="mt-3 text-3xl font-bold">
              Antes de reparar, te explicamos el hallazgo.
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {['Revisamos el sistema', 'Confirmas el alcance', 'Conservas el historial'].map(
              (item, i) => (
                <li key={item} className="border-t border-accent pt-4">
                  <span className="technical-value text-accent">0{i + 1}</span>
                  <p className="mt-4 font-semibold">{item}</p>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>

      <section className="public-section">
        <div className="page-container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Servicios</p>
              <h2 className="mt-3 text-3xl font-bold">Elige por síntoma o por servicio.</h2>
            </div>
            <Link to="/servicios" className="font-semibold text-primary">
              Ver todos los servicios →
            </Link>
          </div>
          <div className="mt-10 divide-y divide-border border-y border-border">
            {(servicios || []).map((service, index) => (
              <Link
                key={service.id}
                to={`/servicios/${service.slug}`}
                className="grid gap-4 py-5 transition-colors hover:bg-muted md:grid-cols-[56px_1fr_180px_100px]"
              >
                <span className="technical-value text-primary">0{index + 1}</span>
                <div>
                  <h3 className="font-display text-xl font-semibold">{service.nombre}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{service.descripcion}</p>
                </div>
                <span className="text-sm text-muted-foreground">{service.duracion}</span>
                <span className="font-semibold">Ver detalle →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="page-container grid gap-8 py-16 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Cobertura</p>
            <h2 className="mt-3 text-3xl font-bold">Elige la sucursal que mejor te funcione.</h2>
            <p className="mt-4 text-muted-foreground">
              Consulta horarios, técnicos y vías de contacto antes de reservar.
            </p>
          </div>
          <ul className="space-y-3">
            {(sucursales || []).map((sucursal) => (
              <li key={sucursal.id}>
                <Link
                  to={`/sucursal/${sucursal.slug}`}
                  className="flex items-center justify-between border border-border p-6 transition-colors hover:bg-muted"
                >
                  <span>
                    <MapPin className="h-5 w-5 text-primary" />
                    <b className="mt-3 block font-display text-xl">{sucursal.nombre}</b>
                    <small className="mt-1 block text-muted-foreground">
                      {sucursal.ciudad} · {sucursal.direccion}
                    </small>
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}

export default Home
