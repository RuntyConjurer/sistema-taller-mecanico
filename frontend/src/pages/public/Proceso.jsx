import { processSteps } from '@/data/mocks/landing.mock'
import WorkshopMedia from '@/components/common/WorkshopMedia'

function Proceso() {
  return (
    <section className="section-padding">
      <div className="page-container space-y-10">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Proceso</p>
          <h1 className="mt-2 text-4xl font-bold">Del ingreso a la entrega, sin sorpresas</h1>
          <p className="mt-3 text-muted-foreground">
            Cada vehículo sigue un flujo controlado: recepción, diagnóstico HVAC, reparación autorizada, facturación y entrega.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <ol className="divide-y divide-border border-y border-border">
            {processSteps.map((step, index) => (
              <li key={step.step} className="grid grid-cols-[48px_1fr] gap-4 py-5"><span className="technical-value text-primary">0{index + 1}</span><div><h2 className="font-display text-xl font-semibold">{step.title}</h2><p className="mt-2 text-sm text-muted-foreground">{step.description}</p></div></li>
            ))}
          </ol>
          <WorkshopMedia className="h-80 lg:h-full" />
        </div>
      </div>
    </section>
  )
}

export default Proceso
