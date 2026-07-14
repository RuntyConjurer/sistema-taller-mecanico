import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Snowflake, Droplets } from 'lucide-react'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import StatusBadge from '@/components/domain/StatusBadge'
import { getStockState } from '@/constants/domainStates'
import { useAsyncData } from '@/hooks/useAsyncData'
import {
  listarOrdenesParaConsumo,
  listarRefrigerantes,
  registrarConsumoRefrigerante,
} from '@/services/inventarioService'
import { usingMocks } from '@/services/dataSource'
import { formatQuantity } from '@/utils/formatters'

// El nivel se mide contra el stock mínimo del propio material, que es el dato con
// el que la base de datos decide si hay que reordenar. 100% significa "en el mínimo".
function levelPercent(stockActual, stockMinimo) {
  if (!stockMinimo) return 100
  return Math.min(100, Math.round((stockActual / stockMinimo) * 100))
}

function Refrigerantes() {
  // consumo representa el formulario de recarga: orden asociada, refrigerante y
  // cantidad usada.
  const [consumo, setConsumo] = useState({ ordenId: '', refrigeranteId: '', cantidad: '' })
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  // reload() vuelve a pedir las existencias tras registrar una recarga.
  const {
    data,
    isLoading,
    error: loadError,
    reload,
  } = useAsyncData(async () => {
    const [refrigerantes, ordenes] = await Promise.all([
      listarRefrigerantes(),
      listarOrdenesParaConsumo(),
    ])
    return { refrigerantes, ordenes }
  }, [])

  const refrigerantes = data?.refrigerantes ?? []
  const ordenes = data?.ordenes ?? []

  async function submit(event) {
    event.preventDefault()
    // La pantalla hace una validacion basica para dar respuesta inmediata; el
    // trigger de inventario en backend debe validar el stock definitivo.
    setFeedback('')
    setError('')
    if (!consumo.ordenId || !consumo.refrigeranteId || !consumo.cantidad) {
      setError('Selecciona una orden, un refrigerante y la cantidad consumida.')
      return
    }
    try {
      const result = await registrarConsumoRefrigerante(consumo)
      reload()
      setFeedback(
        usingMocks
          ? `Consumo demo registrado. Stock restante: ${formatQuantity(result.remaining, result.unidadMedida)}.`
          : 'Consumo enviado para registrar.',
      )
      setConsumo((current) => ({ ...current, cantidad: '' }))
    } catch (submitError) {
      setError(submitError.message || 'No fue posible registrar el consumo.')
    }
  }

  if (loadError) return <ErrorState description={loadError} />
  if (isLoading) return <LoadingSkeleton rows={5} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Control especializado"
        title="Refrigerantes"
        description="Existencia por tipo, consumo por orden y trazabilidad de recargas."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {refrigerantes.map((item) => {
          // Cada tarjeta calcula su estado desde stock actual y minimo, el mismo
          // criterio usado por Inventario.
          const percent = levelPercent(item.stockActual, item.stockMinimo)
          const estado = getStockState(item.stockActual, item.stockMinimo)
          return (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{item.nombre}</CardTitle>
                <div className="bg-secondary p-2 text-primary">
                  <Snowflake className="h-4 w-4" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-bold">
                  {formatQuantity(item.stockActual, item.unidadMedida)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatQuantity(item.consumoMes, item.unidadMedida)} consumidos este mes ·{' '}
                  {item.ordenes} órdenes
                </p>
                <div>
                  <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                    <span>Nivel sobre el mínimo</span>
                    <span>{formatQuantity(item.stockMinimo, item.unidadMedida)} mín.</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden bg-muted"
                    role="meter"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Nivel de ${item.nombre} respecto al stock mínimo`}
                  >
                    <div
                      className={
                        estado === 'STOCK_OPTIMO' ? 'h-full bg-primary' : 'h-full bg-warning'
                      }
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
                <StatusBadge group="stock" status={estado} />
              </CardContent>
            </Card>
          )
        })}
      </div>
      <DataTable
        columns={[
          { key: 'nombre', label: 'Refrigerante' },
          {
            key: 'stockActual',
            label: 'Existencia',
            render: (row) => formatQuantity(row.stockActual, row.unidadMedida),
          },
          {
            key: 'consumoMes',
            label: 'Consumo del mes',
            render: (row) => formatQuantity(row.consumoMes, row.unidadMedida),
          },
          { key: 'ordenes', label: 'Órdenes' },
          {
            key: 'estado',
            label: 'Estado',
            render: (row) => (
              <StatusBadge group="stock" status={getStockState(row.stockActual, row.stockMinimo)} />
            ),
          },
        ]}
        rows={refrigerantes}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Droplets className="h-4 w-4 text-primary" />
            Registrar recarga
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            La demostración valida stock local; el backend y su trigger validarán el consumo
            definitivo.
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-4" onSubmit={submit} noValidate>
            <div className="space-y-2">
              <Label htmlFor="ordenId">Orden de trabajo</Label>
              <Select
                id="ordenId"
                value={consumo.ordenId}
                onChange={(event) =>
                  setConsumo((current) => ({ ...current, ordenId: event.target.value }))
                }
              >
                <option value="">Selecciona OT</option>
                {ordenes.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.numero} · {order.vehiculo}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refrigeranteId">Refrigerante</Label>
              <Select
                id="refrigeranteId"
                value={consumo.refrigeranteId}
                onChange={(event) =>
                  setConsumo((current) => ({ ...current, refrigeranteId: event.target.value }))
                }
              >
                <option value="">Selecciona refrigerante</option>
                {refrigerantes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nombre} · {formatQuantity(item.stockActual, item.unidadMedida)}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad (kg)</Label>
              <input
                id="cantidad"
                type="number"
                step="0.01"
                min="0.01"
                value={consumo.cantidad}
                onChange={(event) =>
                  setConsumo((current) => ({ ...current, cantidad: event.target.value }))
                }
                className="h-10 w-full border border-input bg-card px-3"
              />
            </div>
            <div className="flex items-end">
              <Button className="w-full" type="submit">
                Registrar consumo demo
              </Button>
            </div>
          </form>
          {error ? (
            <p className="mt-4 text-sm font-medium text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          {feedback ? (
            <p className="mt-4 text-sm font-medium text-success" role="status">
              {feedback}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}

export default Refrigerantes
