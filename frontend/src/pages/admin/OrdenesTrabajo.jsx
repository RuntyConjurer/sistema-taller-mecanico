import { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/domain/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { AlertTriangle, CheckCircle2, LockKeyhole } from 'lucide-react'
import { ordenTimeline } from '@/data/mocks/ordenes.mock'
import { otStatuses } from '@/constants/otStatuses'
import { cerrarOrdenTrabajo, listarOrdenesTrabajo } from '@/services/ordenesService'
import { listarFacturas } from '@/services/facturacionService'
import { usingMocks } from '@/services/dataSource'

function OrdenesTrabajo() {
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS')
  const [ordenes, setOrdenes] = useState([])
  const [facturas, setFacturas] = useState([])
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  async function loadData() {
    try {
      const [orders, invoices] = await Promise.all([listarOrdenesTrabajo(), listarFacturas()])
      setOrdenes(orders)
      setFacturas(invoices)
    } catch (loadError) { setError(loadError.message || 'No fue posible cargar las órdenes.') }
  }
  useEffect(() => { void Promise.resolve().then(loadData) }, [])
  const filtered = useMemo(() => {
    if (estadoFiltro === 'TODOS') return ordenes
    return ordenes.filter((item) => item.estado === estadoFiltro)
  }, [estadoFiltro, ordenes])
  const orden = selected || filtered[0]
  const factura = facturas.find((item) => item.ordenId === orden?.id)
  const canClose = Boolean(orden?.diagnosticoRegistrado && factura?.estado === 'PAGADA')

  async function closeOrder() {
    if (!orden) return
    setError('')
    setFeedback('')
    try {
      const updated = await cerrarOrdenTrabajo(orden.id)
      setSelected(updated)
      await loadData()
      setFeedback(usingMocks ? 'OT cerrada solo en la demostración actual.' : 'Cierre enviado para validar.')
    } catch (closeError) { setError(closeError.message || 'No fue posible cerrar la OT.') }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operación técnica"
        title="Órdenes de Trabajo"
        description="Seguimiento de reparaciones, estados, diagnóstico y facturación."
        action={
          <Button type="button" onClick={() => window.alert('Alta de OT visual — sin persistencia.')}>
            Nueva orden
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="filtro-estado">Filtrar por estado</Label>
          <select
            id="filtro-estado"
            className="h-10 rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value)}
          >
            <option value="TODOS">Todos</option>
            {Object.entries(otStatuses).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'numero', label: 'Orden' },
          { key: 'cliente', label: 'Cliente' },
          { key: 'vehiculo', label: 'Vehículo' },
          { key: 'tecnico', label: 'Técnico' },
          { key: 'prioridad', label: 'Prioridad' },
          { key: 'estado', label: 'Estado', render: (row) => <StatusBadge status={row.estado} /> },
        ]}
        rows={filtered}
        selectedId={orden?.id}
        onRowSelect={setSelected}
        emptyMessage="No hay órdenes con ese estado."
      />

      {orden ? <Card>
        <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle className="text-base">{orden.numero}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {orden.cliente} · {orden.vehiculo}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={orden.estado} />
            <Button size="sm" variant="outline" type="button">
              Asignar técnico
            </Button>
            <Button size="sm" type="button">
              Cambiar estado
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section aria-labelledby="controles-cierre" className="rounded-md border border-border bg-muted/50 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 id="controles-cierre" className="flex items-center gap-2 text-sm font-semibold"><LockKeyhole className="h-4 w-4 text-primary" />Condiciones para cerrar la OT</h2>
                <p className="mt-1 text-sm text-muted-foreground">Las reglas se muestran según el SRS y se validarán nuevamente en el servidor al integrarlo.</p>
              </div>
              <Button size="sm" disabled={!canClose} title={canClose ? 'Cerrar OT' : 'Requiere diagnóstico y factura pagada'} onClick={closeOrder}>Cerrar OT</Button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className={`flex gap-2 rounded border bg-card p-3 text-sm ${orden.diagnosticoRegistrado ? 'border-emerald-700/30' : 'border-amber-800/30'}`}>{orden.diagnosticoRegistrado ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />}{orden.diagnosticoRegistrado ? 'Diagnóstico técnico registrado' : 'Falta diagnóstico para habilitar el cierre'}</div>
              <div className={`flex gap-2 rounded border bg-card p-3 text-sm ${factura?.estado === 'PAGADA' ? 'border-emerald-700/30' : 'border-amber-800/30'}`}>{factura?.estado === 'PAGADA' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-800" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-800" />}{factura?.estado === 'PAGADA' ? 'Factura pagada' : 'Falta factura pagada para habilitar el cierre'}</div>
            </div>
          </section>

          <div className="flex flex-wrap gap-3">
            {ordenTimeline.map((item) => (
              <div key={item.estado} className="rounded-lg border border-border px-3 py-2 text-xs">
                <StatusBadge status={item.estado} />
                <p className="mt-2 text-muted-foreground">{item.fecha}</p>
                <p className="text-muted-foreground">{item.usuario}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="recepcion">
            <TabsList className="flex-wrap">
              <TabsTrigger value="recepcion">Recepción</TabsTrigger>
              <TabsTrigger value="diagnostico">Diagnóstico</TabsTrigger>
              <TabsTrigger value="servicios">Servicios</TabsTrigger>
              <TabsTrigger value="materiales">Materiales</TabsTrigger>
              <TabsTrigger value="refrigerante">Refrigerante</TabsTrigger>
              <TabsTrigger value="facturacion">Facturación</TabsTrigger>
              <TabsTrigger value="historial">Historial</TabsTrigger>
            </TabsList>
            <TabsContent value="recepcion" className="rounded-lg border border-border p-4 text-sm">
              <p>
                <strong>Síntomas:</strong> {orden.sintomas}
              </p>
              <p className="mt-2 text-muted-foreground">
                Recepción: {orden.recepcion} · Prioridad: {orden.prioridad}
              </p>
            </TabsContent>
            <TabsContent value="diagnostico" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              Formulario técnico y mediciones HVAC de la orden seleccionada.
            </TabsContent>
            <TabsContent value="servicios" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              Servicios autorizados y ejecutados con precios aplicados.
            </TabsContent>
            <TabsContent value="materiales" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              Repuestos consumidos y movimientos de inventario asociados.
            </TabsContent>
            <TabsContent value="refrigerante" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              Consumo de gas refrigerante por tipo, cantidad y técnico responsable.
            </TabsContent>
            <TabsContent value="facturacion" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              Estado de factura, pagos y balance pendiente para habilitar entrega.
            </TabsContent>
            <TabsContent value="historial" className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
              Línea de tiempo de cambios de estado y auditoría de la orden.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card> : null}
      {error ? <p className="text-sm font-medium text-destructive" role="alert">{error}</p> : null}{feedback ? <p className="text-sm font-medium text-emerald-800" role="status">{feedback}</p> : null}
    </div>
  )
}

export default OrdenesTrabajo
