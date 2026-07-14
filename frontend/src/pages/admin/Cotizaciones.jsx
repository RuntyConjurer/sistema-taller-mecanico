import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import StatusBadge from '@/components/domain/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAsyncData } from '@/hooks/useAsyncData'
import { listarCotizaciones } from '@/services/cotizacionesService'
import { formatCurrency, formatDate } from '@/utils/formatters'

const tipoItemLabels = {
  SERVICIO: 'Servicio',
  MATERIAL: 'Material',
  REFRIGERANTE: 'Refrigerante',
  CONSUMIBLE: 'Consumible',
}

function Cotizaciones() {
  const [selected, setSelected] = useState(null)
  const { data, isLoading, error } = useAsyncData(() => listarCotizaciones(), [])
  const cotizaciones = data ?? []

  const cotizacion = selected || cotizaciones[0]

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comercial"
        title="Cotizaciones"
        description="Propuesta de alcance y precio que el cliente aprueba antes de abrir la orden."
      />

      <p className="border-l-2 border-warning bg-muted p-4 text-sm text-muted-foreground">
        Módulo propuesto por el equipo. El SRS lo menciona como función, pero no le asigna un
        requisito ni una tabla, así que todavía no hay dónde guardar una cotización: los datos que
        se ven son de muestra. Ya se solicitaron las tablas al equipo de base de datos.
      </p>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={[
            { key: 'numero', label: 'Número' },
            { key: 'cliente', label: 'Cliente' },
            { key: 'vehiculo', label: 'Vehículo' },
            { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
            {
              key: 'estado',
              label: 'Estado',
              render: (row) => <StatusBadge group="cotizacion" status={row.estado} />,
            },
            {
              key: 'vigencia',
              label: 'Vigente hasta',
              render: (row) => formatDate(row.vigencia),
            },
          ]}
          rows={cotizaciones}
          selectedId={cotizacion?.id}
          onRowSelect={setSelected}
          emptyMessage="Todavía no hay cotizaciones registradas."
        />
      )}

      {cotizacion ? (
        <Card>
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">{cotizacion.numero}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {cotizacion.cliente} · {cotizacion.vehiculo}
              </p>
            </div>
            <StatusBadge group="cotizacion" status={cotizacion.estado} />
          </CardHeader>
          <CardContent className="space-y-4">
            <DataTable
              columns={[
                {
                  key: 'tipoItem',
                  label: 'Tipo',
                  render: (row) => tipoItemLabels[row.tipoItem] || row.tipoItem,
                },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'cantidad', label: 'Cant.' },
                {
                  key: 'precioUnitario',
                  label: 'Precio',
                  render: (row) => formatCurrency(row.precioUnitario),
                },
                {
                  key: 'subtotal',
                  label: 'Subtotal',
                  render: (row) => formatCurrency(row.cantidad * row.precioUnitario),
                },
              ]}
              rows={cotizacion.detalles}
            />
            <dl className="ml-auto w-full max-w-xs space-y-1 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="technical-value">{formatCurrency(cotizacion.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ITBIS (18%)</dt>
                <dd className="technical-value">{formatCurrency(cotizacion.impuesto)}</dd>
              </div>
              <div className="flex justify-between border-t border-border pt-1 font-semibold">
                <dt>Total</dt>
                <dd className="technical-value">{formatCurrency(cotizacion.total)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}

export default Cotizaciones
