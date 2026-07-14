import { cn } from '@/lib/utils'

function DataTable({
  columns,
  rows,
  emptyMessage = 'No hay registros para mostrar.',
  onRowSelect,
  selectedId,
}) {
  // Componente generico de tablas: la pantalla decide las columnas y, si una
  // columna necesita formato especial, envia un render(row) para controlar la celda.
  if (!rows?.length)
    return (
      <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )

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
              className={cn(
                'border-b border-border last:border-0 transition-colors',
                selectedId === row.id && 'bg-secondary/50',
              )}
            >
              {columns.map((column) => (
                <td key={column.key} data-label={column.label} className="px-4 py-3">
                  {/* Si no hay render personalizado, se imprime el valor directo
                      usando la llave de la columna. */}
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {onRowSelect ? (
                <td data-label="Acción" className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="min-h-11 border border-border px-3 text-sm font-semibold text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    onClick={() => onRowSelect(row)}
                  >
                    Ver detalle
                    <span className="sr-only">
                      {' '}
                      de {row.numero || row.nombre || row.cliente || row.id}
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
