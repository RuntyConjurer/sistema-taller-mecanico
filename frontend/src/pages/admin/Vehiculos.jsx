import { useEffect, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import DetailPanel from '@/components/common/DetailPanel'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'
import { listarVehiculos } from '@/services/vehiculosService'

function Vehiculos() {
  const [selected, setSelected] = useState(null)
  const [vehiculos, setVehiculos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadVehiculos() {
      try {
        setVehiculos(await listarVehiculos())
      } catch (loadError) {
        setError(loadError.message || 'No fue posible cargar los vehículos.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadVehiculos()
  }, [])

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parque vehicular"
        title="Vehículos"
        description="Consulta por placa, propietario y tipo de refrigerante del sistema."
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={[
            { key: 'placa', label: 'Placa' },
            { key: 'chasis', label: 'Chasis' },
            {
              key: 'marca',
              label: 'Marca / Modelo',
              render: (row) => `${row.marca} ${row.modelo} (${row.anio})`,
            },
            { key: 'color', label: 'Color' },
            { key: 'propietario', label: 'Propietario' },
            {
              key: 'tipoRefrigerante',
              label: 'Refrigerante',
              render: (row) => <Badge variant="info">{row.tipoRefrigerante}</Badge>,
            },
          ]}
          rows={vehiculos}
          selectedId={selected?.id}
          onRowSelect={setSelected}
          emptyMessage="Todavía no hay vehículos registrados."
        />
      )}

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Ficha técnica"
        subtitle={selected ? `${selected.marca} ${selected.modelo}` : ''}
      >
        {selected ? (
          <>
            <p className="technical-value">
              {selected.placa} · {selected.chasis}
            </p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Año</dt>
                <dd>{selected.anio}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Color</dt>
                <dd>{selected.color}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Propietario</dt>
                <dd>{selected.propietario}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Refrigerante</dt>
                <dd>{selected.tipoRefrigerante}</dd>
              </div>
            </dl>
            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
              Todo vehículo pertenece a un cliente registrado: la columna id_cliente de la tabla es
              NOT NULL, así que la base de datos no permite guardarlo sin propietario.
            </p>
          </>
        ) : null}
      </DetailPanel>
    </div>
  )
}

export default Vehiculos
