import ModuleCard from '../components/cards/ModuleCard'
import PageHeader from '../components/common/PageHeader'
import { menuItems } from '../constants/menuItems'

function Dashboard() {
  return (
    <section className="page-stack">
      <PageHeader
        eyebrow="Inicio"
        title="Dashboard"
        description="Vista inicial para organizar los modulos principales del sistema."
      />

      <div className="module-grid">
        {menuItems
          .filter((item) => item.path !== '/')
          .map((item) => (
            <ModuleCard
              key={item.path}
              title={item.label}
              description={item.description}
            />
          ))}
      </div>
    </section>
  )
}

export default Dashboard
