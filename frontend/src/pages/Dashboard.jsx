import ModuleCard from '../components/cards/ModuleCard'
import PageHeader from '../components/common/PageHeader'

const dashboardBlocks = [
  {
    title: 'Resumen de ordenes',
    description: 'Espacio reservado para estados de ordenes abiertas, en proceso y pendientes de cierre.',
  },
  {
    title: 'Vehiculos en reparacion',
    description: 'Bloque conceptual para visualizar vehiculos recibidos y trabajos activos.',
  },
  {
    title: 'Inventario y refrigerantes',
    description: 'Area futura para alertas de piezas, insumos y consumo de refrigerantes.',
  },
  {
    title: 'Facturacion pendiente',
    description: 'Seccion prevista para facturas, pagos pendientes y bloqueos de entrega.',
  },
]

function Dashboard() {
  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="Inicio"
        title="Dashboard"
        description="Vista conceptual para ubicar las areas operativas principales del taller."
      />

      <div className="dashboard-wireframe">
        {dashboardBlocks.map((block) => (
          <ModuleCard
            key={block.title}
            title={block.title}
            description={block.description}
          />
        ))}
      </div>

      <section className="wireframe-panel wireframe-panel-large">
        <div className="wireframe-panel-header">
          <strong>Flujo operativo general</strong>
          <span>Mapa conceptual del contenido futuro</span>
        </div>
        <div className="wire-timeline" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </section>
    </section>
  )
}

export default Dashboard
