import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import DetailPanel from '@/components/common/DetailPanel'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { getStateMeta } from '@/constants/domainStates'
import { useAsyncData } from '@/hooks/useAsyncData'
import { emitirFactura, listarFacturas, registrarPago } from '@/services/facturacionService'
import { listarOrdenesTrabajo } from '@/services/ordenesService'
import { usingMocks } from '@/services/dataSource'
import { formatCurrency } from '@/utils/formatters'

function Facturacion() {
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState({ ordenTrabajoId: '', descuento: '', observaciones: '' })
  const [payment, setPayment] = useState({
    facturaId: '',
    monto: '',
    formaPago: 'EFECTIVO',
    referencia: '',
  })
  const [feedback, setFeedback] = useState('')
  const [actionError, setActionError] = useState('')
  const [busy, setBusy] = useState(false)
  const { data, isLoading, error, reload } = useAsyncData(async () => {
    const [facturas, ordenes] = await Promise.all([listarFacturas(), listarOrdenesTrabajo()])
    return { facturas, ordenes }
  }, [])

  const facturas = data?.facturas ?? []
  const ordenes = data?.ordenes ?? []
  const ordenesSinFactura = ordenes.filter(
    (order) => !facturas.some((invoice) => invoice.ordenId === order.id),
  )

  async function issueInvoice(event) {
    event.preventDefault()
    setFeedback('')
    setActionError('')
    if (!draft.ordenTrabajoId) {
      setActionError('Selecciona una orden de trabajo.')
      return
    }
    if (usingMocks) {
      setFeedback('Vista previa preparada. En modo demostración no se emitió una factura.')
      return
    }
    setBusy(true)
    try {
      const invoice = await emitirFactura(draft)
      setFeedback(`Factura ${invoice.numero} emitida correctamente.`)
      setDraft({ ordenTrabajoId: '', descuento: '', observaciones: '' })
      reload()
    } catch (requestError) {
      setActionError(requestError.message || 'No fue posible emitir la factura.')
    } finally {
      setBusy(false)
    }
  }

  async function applyPayment(event) {
    event.preventDefault()
    setFeedback('')
    setActionError('')
    if (!payment.facturaId || !payment.monto) {
      setActionError('Selecciona una factura e indica el monto recibido.')
      return
    }
    setBusy(true)
    try {
      const invoice = await registrarPago(
        Number(payment.facturaId),
        payment.monto,
        payment.formaPago,
        payment.referencia,
      )
      setPayment((current) => ({ ...current, facturaId: invoice.id, monto: '', referencia: '' }))
      setFeedback(usingMocks ? 'Pago aplicado solo en la demostración.' : 'Pago registrado correctamente.')
      reload()
    } catch (requestError) {
      setActionError(requestError.message || 'No fue posible registrar el pago.')
    } finally {
      setBusy(false)
    }
  }

  if (error) return <ErrorState description={error} />
  if (isLoading) return <LoadingSkeleton rows={5} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Caja"
        title="Facturación"
        description="Emisión de facturas, pagos y balances pendientes."
      />
      <DataTable
        columns={[
          { key: 'numero', label: 'Factura' },
          { key: 'cliente', label: 'Cliente' },
          { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
          { key: 'balance', label: 'Balance', render: (row) => formatCurrency(row.balance) },
          {
            key: 'estado',
            label: 'Estado',
            render: (row) => {
              const state = getStateMeta('factura', row.estado)
              return <Badge variant={state.tone}>{state.label}</Badge>
            },
          },
        ]}
        rows={facturas}
        selectedId={selected?.id}
        onRowSelect={setSelected}
      />
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Emitir factura</CardTitle>
            <p className="text-sm text-muted-foreground">
              El servidor calcula servicios, materiales, ITBIS y total desde la OT.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={issueInvoice}>
              <div className="space-y-2">
                <Label htmlFor="orden-factura">Orden de trabajo</Label>
                <Select
                  id="orden-factura"
                  value={draft.ordenTrabajoId}
                  onChange={(event) => setDraft((current) => ({ ...current, ordenTrabajoId: event.target.value }))}
                >
                  <option value="">Selecciona una OT sin factura</option>
                  {ordenesSinFactura.map((order) => (
                    <option key={order.id} value={order.id}>{order.numero} · {order.cliente}</option>
                  ))}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="descuento-factura">Descuento (DOP)</Label>
                <Input
                  id="descuento-factura"
                  type="number"
                  min="0"
                  value={draft.descuento}
                  onChange={(event) => setDraft((current) => ({ ...current, descuento: event.target.value }))}
                />
              </div>
              <Button type="submit" disabled={busy}>
                {usingMocks ? 'Preparar vista previa' : 'Emitir factura'}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registrar pago</CardTitle>
            <p className="text-sm text-muted-foreground">Aplica el monto a una factura pendiente.</p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={applyPayment}>
              <div className="space-y-2">
                <Label htmlFor="factura-pago">Factura</Label>
                <Select
                  id="factura-pago"
                  value={payment.facturaId}
                  onChange={(event) => setPayment((current) => ({ ...current, facturaId: event.target.value }))}
                >
                  <option value="">Selecciona una factura</option>
                  {facturas.filter((item) => item.balance > 0).map((item) => (
                    <option key={item.id} value={item.id}>{item.numero} · {formatCurrency(item.balance)}</option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="monto-pago">Monto recibido</Label>
                  <Input id="monto-pago" type="text" inputMode="decimal" placeholder="0.00" value={payment.monto} onChange={(event) => setPayment((current) => ({ ...current, monto: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forma-pago">Forma de pago</Label>
                  <Select id="forma-pago" value={payment.formaPago} onChange={(event) => setPayment((current) => ({ ...current, formaPago: event.target.value }))}>
                    <option value="EFECTIVO">Efectivo</option>
                    <option value="TARJETA">Tarjeta</option>
                    <option value="TRANSFERENCIA">Transferencia</option>
                  </Select>
                </div>
              </div>
              {payment.formaPago !== 'EFECTIVO' ? (
                <div className="space-y-2">
                  <Label htmlFor="referencia-pago">Referencia</Label>
                  <Input id="referencia-pago" value={payment.referencia} onChange={(event) => setPayment((current) => ({ ...current, referencia: event.target.value }))} required />
                </div>
              ) : null}
              <Button type="submit" disabled={busy}>Registrar pago</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {actionError ? <p className="text-sm font-medium text-destructive" role="alert">{actionError}</p> : null}
      {feedback ? <p className="text-sm font-medium text-success" role="status">{feedback}</p> : null}
      <DetailPanel open={Boolean(selected)} onClose={() => setSelected(null)} title="Detalle de factura" subtitle={selected?.numero}>
        <p className="text-sm">{selected?.cliente}</p>
        <p className="mt-5 technical-value text-lg">{selected ? formatCurrency(selected.total) : ''}</p>
        <p className="mt-2 text-sm">Balance: {selected ? formatCurrency(selected.balance) : ''}</p>
      </DetailPanel>
    </div>
  )
}

export default Facturacion
