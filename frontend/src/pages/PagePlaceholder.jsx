import PageHeader from '../components/common/PageHeader'
import DataTablePlaceholder from '../components/tables/DataTablePlaceholder'

function PagePlaceholder({ title, description, scope, columns }) {
  return (
    <section className="page-stack">
      <PageHeader title={title} description={description} eyebrow={scope} />
      <DataTablePlaceholder title={`Base de ${title}`} columns={columns} />
    </section>
  )
}

export default PagePlaceholder
