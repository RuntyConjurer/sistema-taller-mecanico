import { useMemo, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import DetailPanel from '@/components/common/DetailPanel'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useAsyncData } from '@/hooks/useAsyncData'
import { listarClientes } from '@/services/clientesService'

// Etiquetas de los CHECK constraints de la tabla `clientes`.
const tipoClienteLabels = { PERSONA: 'Persona', EMPRESA: 'Empresa' }
const tipoIdentificacionLabels = { CEDULA: 'Cédula', RNC: 'RNC', PASAPORTE: 'Pasaporte' }

function Clientes() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const { data: clientes, isLoading, error } = useAsyncData(() => listarClientes(), [])

  // Filtro local para busqueda rapida. Cuando exista paginacion real, este criterio
  // puede moverse al backend sin cambiar la tabla.
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const lista = clientes ?? []
    if (!term) return lista
    return lista.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.identificacion.toLowerCase().includes(term) ||
        item.telefono.includes(term),
    )
  }, [clientes, query])

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gestión de clientes"
        title="Clientes"
        description="Registro y consulta de los clientes del taller."
      />

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <CardTitle className="text-base">Listado de clientes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Busca por nombre, identificación o teléfono.
            </p>
          </div>
          <div className="w-full space-y-2 sm:max-w-xs">
            <Label htmlFor="buscar-cliente">Buscar</Label>
            <Input
              id="buscar-cliente"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. María o 001-"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingSkeleton />
          ) : (
            <DataTable
              columns={[
                { key: 'nombre', label: 'Cliente' },
                {
                  key: 'tipoCliente',
                  label: 'Tipo',
                  render: (row) => tipoClienteLabels[row.tipoCliente] || row.tipoCliente,
                },
                {
                  key: 'identificacion',
                  label: 'Identificación',
                  render: (row) =>
                    `${tipoIdentificacionLabels[row.tipoIdentificacion] || row.tipoIdentificacion}: ${row.identificacion}`,
                },
                { key: 'telefono', label: 'Teléfono' },
                { key: 'vehiculos', label: 'Vehículos' },
                {
                  key: 'activo',
                  label: 'Estado',
                  render: (row) => (
                    <Badge variant={row.activo ? 'success' : 'muted'}>
                      {row.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  ),
                },
              ]}
              rows={filtered}
              selectedId={selected?.id}
              onRowSelect={setSelected}
              emptyMessage="No hay clientes que coincidan con la búsqueda."
            />
          )}
        </CardContent>
      </Card>

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Ficha de cliente"
        subtitle={selected?.nombre}
      >
        {selected ? (
          <>
            <p className="technical-value">{selected.identificacion}</p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Tipo</dt>
                <dd>{tipoClienteLabels[selected.tipoCliente]}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Teléfono</dt>
                <dd>{selected.telefono}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Correo</dt>
                <dd>{selected.email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Dirección</dt>
                <dd className="text-right">{selected.direccion}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Vehículos</dt>
                <dd>{selected.vehiculos}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Órdenes</dt>
                <dd>{selected.ordenes}</dd>
              </div>
            </dl>
            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
              Los vehículos de este cliente y su historial se consultan desde los módulos de
              Vehículos e Historial Técnico.
            </p>
          </>
        ) : null}
      </DetailPanel>
    </div>
  )
}

export default Clientes
