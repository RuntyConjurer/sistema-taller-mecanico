import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import DetailPanel from '@/components/common/DetailPanel'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import StatusBadge from '@/components/domain/StatusBadge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getStockState } from '@/constants/domainStates'
import { useAsyncData } from '@/hooks/useAsyncData'
import { listarMateriales, listarMovimientos } from '@/services/inventarioService'
import { formatCurrency, formatDate, formatQuantity } from '@/utils/formatters'

const categoriaLabels = {
  REPUESTO: 'Repuesto',
  REFRIGERANTE: 'Refrigerante',
  CONSUMIBLE: 'Consumible',
}

function Inventario() {
  const [selected, setSelected] = useState(null)
  const { data, isLoading, error } = useAsyncData(async () => {
    const [materiales, movimientos] = await Promise.all([listarMateriales(), listarMovimientos()])
    return { materiales, movimientos }
  }, [])

  const materiales = data?.materiales ?? []
  const movimientos = data?.movimientos ?? []

  // Mismo cálculo que la vista vw_estado_inventario de PostgreSQL.
  const stockColumn = {
    key: 'estado',
    label: 'Estado',
    render: (row) => (
      <StatusBadge group="stock" status={getStockState(row.stockActual, row.stockMinimo)} />
    ),
  }
  const existenciaColumn = {
    key: 'stockActual',
    label: 'Existencia',
    render: (row) => formatQuantity(row.stockActual, row.unidadMedida),
  }
  const minimoColumn = {
    key: 'stockMinimo',
    label: 'Mínimo',
    render: (row) => formatQuantity(row.stockMinimo, row.unidadMedida),
  }

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Control de existencias"
        title="Inventario"
        description="Materiales, existencias, movimientos y alertas de stock mínimo."
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <Tabs defaultValue="materiales">
          <TabsList>
            <TabsTrigger value="materiales">Materiales</TabsTrigger>
            <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="materiales">
            <DataTable
              columns={[
                { key: 'codigo', label: 'Código' },
                { key: 'nombre', label: 'Material' },
                {
                  key: 'categoria',
                  label: 'Categoría',
                  render: (row) => categoriaLabels[row.categoria] || row.categoria,
                },
                existenciaColumn,
                minimoColumn,
              ]}
              rows={materiales}
              selectedId={selected?.id}
              onRowSelect={setSelected}
            />
          </TabsContent>

          <TabsContent value="movimientos">
            <DataTable
              columns={[
                { key: 'fecha', label: 'Fecha', render: (row) => formatDate(row.fecha) },
                { key: 'material', label: 'Material' },
                { key: 'tipo', label: 'Tipo' },
                {
                  key: 'cantidad',
                  label: 'Cantidad',
                  render: (row) => formatQuantity(row.cantidad, row.unidadMedida),
                },
                { key: 'motivo', label: 'Referencia' },
              ]}
              rows={movimientos}
              emptyMessage="Todavía no hay movimientos registrados."
            />
          </TabsContent>

          <TabsContent value="alertas">
            <DataTable
              columns={[
                { key: 'nombre', label: 'Material' },
                existenciaColumn,
                minimoColumn,
                stockColumn,
              ]}
              rows={materiales.filter(
                (item) => getStockState(item.stockActual, item.stockMinimo) !== 'STOCK_OPTIMO',
              )}
              emptyMessage="Ningún material está por debajo del mínimo."
            />
          </TabsContent>
        </Tabs>
      )}

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detalle del material"
        subtitle={selected?.nombre}
      >
        {selected ? (
          <>
            <p className="technical-value">{selected.codigo}</p>
            <div className="mt-5 space-y-2 text-sm">
              <p>Existencia: {formatQuantity(selected.stockActual, selected.unidadMedida)}</p>
              <p>Mínimo: {formatQuantity(selected.stockMinimo, selected.unidadMedida)}</p>
              <p>Costo unitario: {formatCurrency(selected.costoUnitario)}</p>
              <p>Precio de venta: {formatCurrency(selected.precioVenta)}</p>
              <p>
                Valor en almacén: {formatCurrency(selected.stockActual * selected.costoUnitario)}
              </p>
            </div>
            <div className="mt-5">
              <StatusBadge
                group="stock"
                status={getStockState(selected.stockActual, selected.stockMinimo)}
              />
            </div>
            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
              Los ajustes de stock se registran en la base de datos: un trigger descuenta el
              material y escribe el movimiento al consumirlo en una orden.
            </p>
          </>
        ) : null}
      </DetailPanel>
    </div>
  )
}

export default Inventario
