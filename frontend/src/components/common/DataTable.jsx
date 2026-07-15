import { cn } from '@/lib/utils'

function renderCellValue(value) {
  if (value === undefined || value === null) return ''
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  if (value && typeof value === 'object') {
    return (
      value.nombre || value.numero || value.email || value.placa || value.chasis || value.id || ''
    )
  }
  return String(value)
}

function DataTable({
  columns,
  rows,
  emptyMessage = 'No hay registros para mostrar.',
  onRowSelect,
  selectedId,
  actionLabel = 'Ver detalle',
}) {
  // Componente generico de tablas: la pantalla decide las columnas y, si una
  // columna necesita formato especial, envia un render(row) para controlar la celda.
  if (!rows?.length)
    return (
      <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )

  function selectRow(row) {
    onRowSelect?.(row)
  }

  function handleRowKeyDown(event, row) {
    if (!onRowSelect || !['Enter', ' '].includes(event.key)) return
    event.preventDefault()
    selectRow(row)
  }

  return (
    <div className="overflow-x-auto border border-border bg-card">
      <table className="data-table w-full text-left text-sm">
        <thead className="border-b border-foreground bg-foreground text-white">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-4 py-3 font-semibold">
                {column.label}
              </th>
            ))}
            {onRowSelect ? (
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">Acción</span>
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            // selectedId permite marcar visualmente una fila desde el estado de la
            // pantalla padre, por ejemplo cuando se abre un panel de detalle.
            <tr
              key={row.id}
              data-selected={selectedId === row.id}
              tabIndex={onRowSelect ? 0 : undefined}
              onClick={onRowSelect ? () => selectRow(row) : undefined}
              onKeyDown={onRowSelect ? (event) => handleRowKeyDown(event, row) : undefined}
              className={cn(
                'border-b border-border last:border-0 transition-colors',
                onRowSelect &&
                  'cursor-pointer hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selectedId === row.id && 'bg-secondary/50',
              )}
            >
              {columns.map((column) => (
                <td key={column.key} data-label={column.label} className="px-4 py-3">
                  {/* Si no hay render personalizado, se imprime el valor directo
                      usando la llave de la columna. */}
                  {column.render ? column.render(row) : renderCellValue(row[column.key])}
                </td>
              ))}
              {onRowSelect ? (
                <td data-label="Acción" className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="min-h-11 border border-border px-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={(event) => {
                      event.stopPropagation()
                      selectRow(row)
                    }}
                  >
                    {actionLabel}
                    <span className="sr-only">
                      {' '}
                      de {renderCellValue(row.numero || row.nombre || row.cliente || row.id)}
                    </span>
                  </button>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DataTable
