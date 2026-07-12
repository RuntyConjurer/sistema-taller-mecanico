import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import DetailPanel from '@/components/common/DetailPanel'
import { listarVehiculos } from '@/services/vehiculosService'

function Vehiculos() {
  const [selected, setSelected] = useState(null)
  const [vehiculos, setVehiculos] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    void Promise.resolve().then(async () => {
      try {
        setVehiculos(await listarVehiculos())
      } catch (loadError) {
        setError(loadError.message || 'No fue posible cargar los vehículos.')
      }
    })
  }, [])
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parque vehicular"
        title="Vehículos"
        description="Consulta técnica por placa, propietario y refrigerante recomendado."
        actionLabel="Agregar vehículo"
        actionTo="/app/vehiculos"
      />

      <DataTable
        columns={[
          { key: 'placa', label: 'Placa' },
          { key: 'chasis', label: 'Chasis' },
          { key: 'marca', label: 'Marca / Modelo', render: (row) => `${row.marca} ${row.modelo}` },
          { key: 'propietario', label: 'Propietario' },
          {
            key: 'refrigerante',
            label: 'Refrigerante',
            render: (row) => <Badge variant="info">{row.refrigerante}</Badge>,
          },
        ]}
        rows={vehiculos}
        selectedId={selected?.id}
        onRowSelect={setSelected}
      />

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Ficha técnica"
        subtitle={selected ? `${selected.marca} ${selected.modelo}` : ''}
      >
        <p className="technical-value">
          {selected?.placa} · {selected?.chasis}
        </p>
        <p className="mt-5 text-sm">Propietario: {selected?.propietario}</p>
        <p className="mt-3 text-sm">Refrigerante: {selected?.refrigerante}</p>
        <p className="mt-8 border-t border-border pt-4 text-sm text-muted-foreground">
          Historial cronológico, diagnósticos, materiales y facturación aparecerán aquí al conectar
          datos.
        </p>
      </DetailPanel>
      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ficha técnica (vista previa)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border p-4 text-sm">
            <p className="font-semibold">Toyota Corolla 2019</p>
            <p className="mt-2 text-muted-foreground">Placa A123456 · R-134a · Capacidad 650g</p>
          </div>
          <div className="rounded-lg border border-border p-4 text-sm text-muted-foreground">
            Historial cronológico de diagnósticos, servicios, materiales y facturas del vehículo.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Vehiculos
