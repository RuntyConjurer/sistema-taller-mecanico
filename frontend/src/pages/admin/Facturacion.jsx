import { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { formatCurrency } from '@/utils/formatters'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import DetailPanel from '@/components/common/DetailPanel'
import { getStateMeta } from '@/constants/domainStates'
import { listarFacturas, registrarPago } from '@/services/facturacionService'
import { listarOrdenesTrabajo } from '@/services/ordenesService'
import { usingMocks } from '@/services/dataSource'

const billableItems = [
  { id: 'diagnostico', label: 'Diagnóstico HVAC', price: 1800 },
  { id: 'recarga', label: 'Recarga de refrigerante', price: 4200 },
  { id: 'filtro', label: 'Filtro secador', price: 2900 },
]

function Facturacion() {
  const [facturas, setFacturas] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [selected, setSelected] = useState(null)
  const [draft, setDraft] = useState({ ordenId: '', items: ['diagnostico'] })
  const [payment, setPayment] = useState({ facturaId: '', monto: '' })
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  async function loadData() {
    try {
      const [invoiceData, workOrders] = await Promise.all([
        listarFacturas(),
        listarOrdenesTrabajo(),
      ])
      setFacturas(invoiceData)
      setOrdenes(workOrders)
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar facturación.')
    }
  }

  useEffect(() => {
    void Promise.resolve().then(loadData)
  }, [])
  const draftTotal = useMemo(
    () =>
      billableItems
        .filter((item) => draft.items.includes(item.id))
        .reduce((sum, item) => sum + item.price, 0),
    [draft.items],
  )

  function toggleItem(id) {
    setDraft((current) => ({
      ...current,
      items: current.items.includes(id)
        ? current.items.filter((item) => item !== id)
        : [...current.items, id],
    }))
  }

  function prepareInvoice(event) {
    event.preventDefault()
    setFeedback('')
    setError('')
    if (!draft.ordenId || !draft.items.length) {
      setError('Selecciona una OT y al menos un servicio o material.')
      return
    }
    setFeedback(
      `${usingMocks ? 'Vista previa demo: ' : ''}factura para la OT seleccionada por ${formatCurrency(draftTotal)}. Su emisión real requiere API.`,
    )
  }

  async function applyPayment(event) {
    event.preventDefault()
    setFeedback('')
    setError('')
    if (!payment.facturaId || !payment.monto) {
      setError('Selecciona una factura e indica el monto recibido.')
      return
    }
    try {
      const updated = await registrarPago(Number(payment.facturaId), Number(payment.monto))
      await loadData()
      setPayment({ facturaId: updated.id, monto: '' })
      setFeedback(
        usingMocks
          ? 'Pago aplicado solo en la demostración actual.'
          : 'Pago enviado para registrar.',
      )
    } catch (paymentError) {
      setError(paymentError.message || 'No fue posible aplicar el pago.')
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Caja"
        title="Facturación"
        description="Emisión de facturas, registro de pagos y control de balances pendientes."
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
            <CardTitle className="text-base">Preparar factura</CardTitle>
            <p className="text-sm text-muted-foreground">
              Relaciona una OT con servicios y materiales. La emisión real se habilita cuando el
              backend exponga el endpoint.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={prepareInvoice}>
              <div className="space-y-2">
                <Label htmlFor="orden-factura">Orden de trabajo</Label>
                <select
                  id="orden-factura"
                  value={draft.ordenId}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, ordenId: event.target.value }))
                  }
                  className="h-10 w-full border border-input bg-card px-3"
                >
                  <option value="">Selecciona una OT</option>
                  {ordenes.map((order) => (
                    <option key={order.id} value={order.id}>
                      {order.numero} · {order.cliente}
                    </option>
                  ))}
                </select>
              </div>
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Detalle facturable</legend>
                <div className="space-y-2">
                  {billableItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex min-h-11 items-center justify-between border border-border px-3 text-sm"
                    >
                      <span>
                        <input
                          type="checkbox"
                          className="mr-3"
                          checked={draft.items.includes(item.id)}
                          onChange={() => toggleItem(item.id)}
                        />
                        {item.label}
                      </span>
                      <span className="technical-value">{formatCurrency(item.price)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="font-semibold">Total estimado</span>
                <span className="technical-value text-lg">{formatCurrency(draftTotal)}</span>
              </div>
              <Button type="submit">Preparar factura demo</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Registrar pago</CardTitle>
            <p className="text-sm text-muted-foreground">
              Un saldo en cero cambia la factura a pagada en la demostración.
            </p>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={applyPayment}>
              <div className="space-y-2">
                <Label htmlFor="factura-pago">Factura</Label>
                <select
                  id="factura-pago"
                  value={payment.facturaId}
                  onChange={(event) =>
                    setPayment((current) => ({ ...current, facturaId: event.target.value }))
                  }
                  className="h-10 w-full border border-input bg-card px-3"
                >
                  <option value="">Selecciona una factura</option>
                  {facturas
                    .filter((item) => item.balance > 0)
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.numero} · Balance {formatCurrency(item.balance)}
                      </option>
                    ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto-pago">Monto recibido (DOP)</Label>
                <Input
                  id="monto-pago"
                  type="number"
                  min="1"
                  value={payment.monto}
                  onChange={(event) =>
                    setPayment((current) => ({ ...current, monto: event.target.value }))
                  }
                />
              </div>
              <Button type="submit">Aplicar pago demo</Button>
            </form>
          </CardContent>
        </Card>
      </div>
      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {feedback ? (
        <p className="text-sm font-medium text-success" role="status">
          {feedback}
        </p>
      ) : null}
      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detalle de factura"
        subtitle={selected?.numero}
      >
        <p className="text-sm">{selected?.cliente}</p>
        <p className="mt-5 technical-value text-lg">
          {selected ? formatCurrency(selected.total) : ''}
        </p>
        <p className="mt-2 text-sm">Balance: {selected ? formatCurrency(selected.balance) : ''}</p>
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Los cambios se conservan solo mientras dure esta demostración.
        </p>
      </DetailPanel>
    </div>
  )
}

export default Facturacion
