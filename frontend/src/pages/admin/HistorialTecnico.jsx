import { useEffect, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import DetailPanel from '@/components/common/DetailPanel'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import StatusBadge from '@/components/domain/StatusBadge'
import { Label } from '@/components/ui/label'
import { listarVehiculos } from '@/services/vehiculosService'
import { listarHistorialPorVehiculo } from '@/services/historialService'
import { formatDate } from '@/utils/formatters'

function HistorialTecnico() {
  const [vehiculos, setVehiculos] = useState([])
  const [vehiculoId, setVehiculoId] = useState('')
  const [historial, setHistorial] = useState([])
  const [selected, setSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // El historial se consulta por vehículo, que es como lo pide el RF-11.
  useEffect(() => {
    async function loadVehiculos() {
      try {
        const items = await listarVehiculos()
        setVehiculos(items)
        setVehiculoId(items[0] ? String(items[0].id) : '')
      } catch (loadError) {
        setError(loadError.message || 'No fue posible cargar los vehículos.')
        setIsLoading(false)
      }
    }
    void loadVehiculos()
  }, [])

  useEffect(() => {
    if (!vehiculoId) return
    async function loadHistorial() {
      try {
        setHistorial(await listarHistorialPorVehiculo(vehiculoId))
        setSelected(null)
      } catch (loadError) {
        setError(loadError.message || 'No fue posible cargar el historial.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadHistorial()
  }, [vehiculoId])

  const vehiculo = vehiculos.find((item) => String(item.id) === vehiculoId)

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Consulta técnica"
        title="Historial Técnico"
        description="Reparaciones, diagnósticos y recomendaciones anteriores de un vehículo."
      />

      <div className="w-full space-y-2 sm:max-w-sm">
        <Label htmlFor="vehiculo-historial">Vehículo</Label>
        <select
          id="vehiculo-historial"
          className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={vehiculoId}
          onChange={(event) => setVehiculoId(event.target.value)}
        >
          {vehiculos.map((item) => (
            <option key={item.id} value={item.id}>
              {item.placa} · {item.marca} {item.modelo} · {item.propietario}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={[
            { key: 'fecha', label: 'Fecha', render: (row) => formatDate(row.fecha) },
            { key: 'numeroOrden', label: 'Orden' },
            { key: 'descripcion', label: 'Trabajo realizado' },
            { key: 'tecnico', label: 'Técnico' },
            {
              key: 'estado',
              label: 'Estado',
              render: (row) => <StatusBadge status={row.estado} />,
            },
          ]}
          rows={historial}
          selectedId={selected?.id}
          onRowSelect={setSelected}
          emptyMessage={
            vehiculo
              ? `${vehiculo.placa} todavía no tiene intervenciones registradas.`
              : 'Selecciona un vehículo.'
          }
        />
      )}

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Intervención registrada"
        subtitle={selected?.numeroOrden}
      >
        {selected ? (
          <>
            <p className="technical-value">{formatDate(selected.fecha)}</p>
            <p className="mt-5 text-sm">{selected.descripcion}</p>
            <div className="mt-5 border-t border-border pt-4 text-sm">
              <b>Recomendaciones</b>
              <p className="mt-2 text-muted-foreground">{selected.recomendaciones}</p>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">Técnico: {selected.tecnico}</p>
          </>
        ) : null}
      </DetailPanel>
    </div>
  )
}

export default HistorialTecnico
