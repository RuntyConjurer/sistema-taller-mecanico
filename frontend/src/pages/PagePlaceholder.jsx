import PageHeader from '../components/common/PageHeader'
import DataTablePlaceholder from '../components/tables/DataTablePlaceholder'

function PagePlaceholder({ title, description, scope, columns }) {
  return (
    <section className="page-stack">
      <PageHeader title={title} description={description} eyebrow={scope} />
      <section className="wireframe-panel">
        <div className="wireframe-panel-header">
          <strong>Area de trabajo del modulo</strong>
          <span>Formulario, filtros o acciones futuras</span>
        </div>
        <div className="wireframe-blocks" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </section>
      <DataTablePlaceholder title={`Placeholder de ${title}`} columns={columns} />
    </section>
  )
}

export default PagePlaceholder
