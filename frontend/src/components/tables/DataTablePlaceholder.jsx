function DataTablePlaceholder({ title = 'Tabla pendiente', columns = [] }) {
  return (
    <section className="table-placeholder" aria-label={title}>
      <div className="table-placeholder-header">
        <strong>{title}</strong>
        <span>Vista conceptual sin datos reales</span>
      </div>
      <div className="wire-filter-row" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className="table-placeholder-grid">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
      <div className="wire-table-body" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </section>
  )
}

export default DataTablePlaceholder
