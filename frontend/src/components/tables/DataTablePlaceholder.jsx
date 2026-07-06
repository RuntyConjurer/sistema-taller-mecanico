function DataTablePlaceholder({ title = 'Tabla pendiente', columns = [] }) {
  return (
    <section className="table-placeholder" aria-label={title}>
      <div className="table-placeholder-header">
        <strong>{title}</strong>
        <span>Sin datos conectados</span>
      </div>
      <div className="table-placeholder-grid">
        {columns.map((column) => (
          <span key={column}>{column}</span>
        ))}
      </div>
    </section>
  )
}

export default DataTablePlaceholder
