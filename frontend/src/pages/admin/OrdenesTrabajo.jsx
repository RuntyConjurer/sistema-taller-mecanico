import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import StatusBadge from '@/components/domain/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { AlertTriangle, CheckCircle2, LockKeyhole } from 'lucide-react'
import { otStatuses } from '@/constants/otStatuses'
import { useAsyncData } from '@/hooks/useAsyncData'
import {
  cerrarOrdenTrabajo,
  listarOrdenesTrabajo,
  obtenerHistorialOrden,
} from '@/services/ordenesService'
import { listarFacturas } from '@/services/facturacionService'
import { usingMocks } from '@/services/dataSource'

const relatedModules = [
  { to: '/app/diagnosticos', label: 'Diagnóstico' },
  { to: '/app/servicios', label: 'Servicios' },
  { to: '/app/inventario', label: 'Materiales' },
  { to: '/app/refrigerantes', label: 'Refrigerante' },
  { to: '/app/facturacion', label: 'Facturación' },
  { to: '/app/historial-tecnico', label: 'Historial técnico' },
]

function OrdenesTrabajo() {
  const { sucursalId } = useOutletContext()
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS')
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  // Se recarga sola al cambiar de sucursal, y con reload() después de cerrar una OT.
  const {
    data,
    isLoading,
    error: loadError,
    reload,
  } = useAsyncData(async () => {
    const [ordenes, facturas, historial] = await Promise.all([
      listarOrdenesTrabajo(sucursalId),
      listarFacturas(),
      obtenerHistorialOrden(),
    ])
    return { ordenes, facturas, historial }
  }, [sucursalId])

  const facturas = data?.facturas ?? []
  const historial = data?.historial ?? []

  // La lista filtrada es dato derivado: depende de las ordenes cargadas y del
  // estado elegido en el select.
  const filtered = useMemo(() => {
    const ordenes = data?.ordenes ?? []
    if (estadoFiltro === 'TODOS') return ordenes
    return ordenes.filter((item) => item.estado === estadoFiltro)
  }, [estadoFiltro, data])
  const orden = selected || filtered[0]
  const factura = facturas.find((item) => item.ordenId === orden?.id)
  // Regla visual del SRS: solo se habilita cerrar cuando hay diagnostico y factura
  // pagada. El backend debe repetir esta validacion.
  const canClose = Boolean(orden?.diagnosticoRegistrado && factura?.estado === 'PAGADA')

  async function closeOrder() {
    // El cierre se delega al service para que la regla del mock y la API compartan
    // el mismo punto de entrada desde la interfaz.
    if (!orden) return
    setError('')
    setFeedback('')
    try {
      const updated = await cerrarOrdenTrabajo(orden.id)
      setSelected(updated)
      reload()
      setFeedback(
        usingMocks ? 'OT cerrada solo en la demostración actual.' : 'Cierre enviado para validar.',
      )
    } catch (closeError) {
      setError(closeError.message || 'No fue posible cerrar la OT.')
    }
  }

  if (loadError) return <ErrorState description={loadError} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operación técnica"
        title="Órdenes de Trabajo"
        description="Seguimiento de reparaciones, estados, diagnóstico y facturación."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="filtro-estado">Filtrar por estado</Label>
          <Select
            id="filtro-estado"
            className="sm:w-56"
            value={estadoFiltro}
            onChange={(event) => setEstadoFiltro(event.target.value)}
          >
            <option value="TODOS">Todos</option>
            {Object.entries(otStatuses).map(([key, value]) => (
              <option key={key} value={key}>
                {value.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={[
            { key: 'numero', label: 'Orden' },
            { key: 'cliente', label: 'Cliente' },
            { key: 'vehiculo', label: 'Vehículo' },
            { key: 'tecnico', label: 'Técnico' },
            { key: 'prioridad', label: 'Prioridad' },
            {
              key: 'estado',
              label: 'Estado',
              render: (row) => <StatusBadge status={row.estado} />,
            },
          ]}
          rows={filtered}
          selectedId={orden?.id}
          onRowSelect={setSelected}
          emptyMessage="No hay órdenes con ese estado."
        />
      )}

      {orden ? (
        <Card>
          <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base">{orden.numero}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {orden.cliente} · {orden.vehiculo}
              </p>
            </div>
            <StatusBadge status={orden.estado} />
          </CardHeader>
          <CardContent className="space-y-6">
            <section
              aria-labelledby="controles-cierre"
              className="rounded-md border border-border bg-muted/50 p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2
                    id="controles-cierre"
                    className="flex items-center gap-2 text-sm font-semibold"
                  >
                    <LockKeyhole className="h-4 w-4 text-primary" />
                    Condiciones para cerrar la OT
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Las reglas se muestran según el SRS y se validarán nuevamente en el servidor al
                    integrarlo.
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={!canClose}
                  title={canClose ? 'Cerrar OT' : 'Requiere diagnóstico y factura pagada'}
                  onClick={closeOrder}
                >
                  Cerrar OT
                </Button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div
                  className={`flex gap-2 rounded border bg-card p-3 text-sm ${orden.diagnosticoRegistrado ? 'border-success/30' : 'border-warning/30'}`}
                >
                  {orden.diagnosticoRegistrado ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  )}
                  {orden.diagnosticoRegistrado
                    ? 'Diagnóstico técnico registrado'
                    : 'Falta diagnóstico para habilitar el cierre'}
                </div>
                <div
                  className={`flex gap-2 rounded border bg-card p-3 text-sm ${factura?.estado === 'PAGADA' ? 'border-success/30' : 'border-warning/30'}`}
                >
                  {factura?.estado === 'PAGADA' ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  )}
                  {factura?.estado === 'PAGADA'
                    ? 'Factura pagada'
                    : 'Falta factura pagada para habilitar el cierre'}
                </div>
              </div>
            </section>

            <section aria-labelledby="recepcion" className="rounded-md border border-border p-4">
              <h2 id="recepcion" className="text-sm font-semibold">
                Recepción
              </h2>
              <p className="mt-2 text-sm">
                <strong>Síntomas:</strong> {orden.sintomas}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Recibida por {orden.recepcion} · Prioridad {orden.prioridad}
              </p>
            </section>

            <section aria-labelledby="linea-tiempo">
              <h2 id="linea-tiempo" className="text-sm font-semibold">
                Línea de tiempo
              </h2>
              <ol className="mt-3 flex flex-wrap gap-3">
                {historial.map((item) => (
                  <li
                    key={item.estado}
                    className="rounded-md border border-border px-3 py-2 text-xs"
                  >
                    <StatusBadge status={item.estado} />
                    <p className="mt-2 text-muted-foreground">{item.fecha}</p>
                    <p className="text-muted-foreground">{item.usuario}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* El resto del expediente de la OT vive en sus propios módulos. Enlazar
                evita duplicar aquí pantallas que ya existen. */}
            <nav
              aria-label="Módulos relacionados con la orden"
              className="border-t border-border pt-4"
            >
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-primary">
                {relatedModules.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="hover:underline">
                      {item.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </CardContent>
        </Card>
      ) : null}
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
    </div>
  )
}

export default OrdenesTrabajo
