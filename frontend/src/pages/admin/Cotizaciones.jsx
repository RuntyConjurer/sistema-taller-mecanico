import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import StatusBadge from '@/components/domain/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAsyncData } from '@/hooks/useAsyncData'
import {
  actualizarEstadoCotizacion,
  convertirCotizacionEnOrden,
  listarCotizaciones,
} from '@/services/cotizacionesService'
import { usingMocks } from '@/services/dataSource'
import { formatCurrency, formatDate } from '@/utils/formatters'

const tipoItemLabels = {
  SERVICIO: 'Servicio',
  MATERIAL: 'Material',
  REFRIGERANTE: 'Refrigerante',
  CONSUMIBLE: 'Consumible',
}

function Cotizaciones() {
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const { data, isLoading, error, reload } = useAsyncData(() => listarCotizaciones(), [])
  const cotizaciones = data ?? []
  const cotizacion = selected || cotizaciones[0]

  async function changeStatus(estado) {
    setBusy(true)
    setFeedback('')
    setActionError('')
    try {
      const updated = await actualizarEstadoCotizacion(cotizacion.id, estado)
      setSelected(updated)
      setFeedback(usingMocks ? 'Estado actualizado solo en la demostración.' : 'Estado actualizado.')
      reload()
    } catch (requestError) {
      setActionError(requestError.message || 'No fue posible actualizar la cotización.')
    } finally {
      setBusy(false)
    }
  }

  async function convertToOrder() {
    setBusy(true)
    setFeedback('')
    setActionError('')
    try {
      const order = await convertirCotizacionEnOrden(cotizacion.id)
      setFeedback(`Orden ${order.numero} creada desde la cotización.`)
    } catch (requestError) {
      setActionError(requestError.message || 'No fue posible crear la orden.')
    } finally {
      setBusy(false)
    }
  }

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comercial"
        title="Cotizaciones"
        description="Alcance y precio que el cliente revisa antes de abrir la orden."
      />
      {usingMocks ? (
        <p className="border-l-2 border-warning bg-muted p-4 text-sm text-muted-foreground">
          Los cambios de este módulo son demostrativos y no persisten al recargar.
        </p>
      ) : null}
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
            { key: 'vigencia', label: 'Vigente hasta', render: (row) => formatDate(row.vigencia) },
          ]}
          rows={cotizaciones}
          selectedId={cotizacion?.id}
          onRowSelect={setSelected}
          emptyMessage="Todavía no hay cotizaciones registradas."
        />
      )}
      {cotizacion ? (
        <Card>
          <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">{cotizacion.numero}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {cotizacion.cliente} · {cotizacion.vehiculo}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge group="cotizacion" status={cotizacion.estado} />
              {cotizacion.estado === 'BORRADOR' ? (
                <Button size="sm" disabled={busy} onClick={() => changeStatus('ENVIADA')}>
                  Enviar
                </Button>
              ) : null}
              {cotizacion.estado === 'ENVIADA' ? (
                <Button size="sm" disabled={busy} onClick={() => changeStatus('APROBADA')}>
                  Aprobar
                </Button>
              ) : null}
              {cotizacion.estado === 'APROBADA' ? (
                <Button size="sm" disabled={busy} onClick={convertToOrder}>
                  Crear OT
                </Button>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <DataTable
              columns={[
                { key: 'tipoItem', label: 'Tipo', render: (row) => tipoItemLabels[row.tipoItem] || row.tipoItem },
                { key: 'descripcion', label: 'Descripción' },
                { key: 'cantidad', label: 'Cant.' },
                { key: 'precioUnitario', label: 'Precio', render: (row) => formatCurrency(row.precioUnitario) },
                { key: 'subtotal', label: 'Subtotal', render: (row) => formatCurrency(row.cantidad * row.precioUnitario) },
              ]}
              rows={cotizacion.detalles || []}
            />
            <dl className="ml-auto w-full max-w-xs space-y-1 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="technical-value">{formatCurrency(cotizacion.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">ITBIS (18%)</dt><dd className="technical-value">{formatCurrency(cotizacion.impuesto)}</dd></div>
              <div className="flex justify-between border-t border-border pt-1 font-semibold"><dt>Total</dt><dd className="technical-value">{formatCurrency(cotizacion.total)}</dd></div>
            </dl>
          </CardContent>
        </Card>
      ) : null}
      {actionError ? <p className="text-sm font-medium text-destructive" role="alert">{actionError}</p> : null}
      {feedback ? <p className="text-sm font-medium text-success" role="status">{feedback}</p> : null}
    </div>
  )
}

export default Cotizaciones
