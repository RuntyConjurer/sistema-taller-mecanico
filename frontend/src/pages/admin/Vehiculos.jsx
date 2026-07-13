import { useMemo, useState } from 'react'
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
import { useAsyncData } from '@/hooks/useAsyncData'
import { listarVehiculos } from '@/services/vehiculosService'

function Vehiculos() {
  const [query, setQuery] = useState('')
  const [refrigerante, setRefrigerante] = useState('')
  const [selected, setSelected] = useState(null)

  const { data, isLoading, error } = useAsyncData(() => listarVehiculos(), [])

  const vehiculos = data ?? []

  const tiposRefrigerante = useMemo(() => {
    return [...new Set(vehiculos.map((vehiculo) => vehiculo.tipoRefrigerante))]
  }, [vehiculos])

  const vehiculosFiltrados = useMemo(() => {
    const term = query.trim().toLowerCase()

    return vehiculos.filter((vehiculo) => {
      const coincideBusqueda =
        !term ||
        vehiculo.placa.toLowerCase().includes(term) ||
        vehiculo.chasis.toLowerCase().includes(term) ||
        vehiculo.marca.toLowerCase().includes(term) ||
        vehiculo.modelo.toLowerCase().includes(term) ||
        vehiculo.propietario.toLowerCase().includes(term)

      const coincideRefrigerante =
        !refrigerante || vehiculo.tipoRefrigerante === refrigerante

      return coincideBusqueda && coincideRefrigerante
    })
  }, [vehiculos, query, refrigerante])

  function limpiarFiltros() {
    setQuery('')
    setRefrigerante('')
  }

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Parque vehicular"
        title="Vehículos"
        description="Consulta los vehículos registrados por placa, propietario o tipo de refrigerante."
      />

      <Card>
        <CardHeader className="gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <CardTitle className="text-base">Listado de vehículos</CardTitle>
            <p className="text-sm text-muted-foreground">
              Busca por placa, chasis, marca, modelo o propietario.
            </p>
          </div>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:max-w-2xl lg:grid-cols-[1fr_180px_auto]">
            <div className="space-y-2">
              <Label htmlFor="buscar-vehiculo">Buscar</Label>
              <Input
                id="buscar-vehiculo"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Ej. A123456 o Toyota"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="filtrar-refrigerante">Refrigerante</Label>
              <Select
                id="filtrar-refrigerante"
                value={refrigerante}
                onChange={(event) => setRefrigerante(event.target.value)}
              >
                <option value="">Todos</option>

                {tiposRefrigerante.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              type="button"
              variant="outline"
              className="self-end"
              onClick={limpiarFiltros}
              disabled={!query && !refrigerante}
            >
              Limpiar
            </Button>
          </div>
        </CardHeader>

        <CardContent>
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
              rows={vehiculosFiltrados}
              selectedId={selected?.id}
              onRowSelect={setSelected}
              emptyMessage="No hay vehículos que coincidan con los filtros."
            />
          )}
        </CardContent>
      </Card>

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

              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Estado</dt>
                <dd>{selected.activo ? 'Activo' : 'Inactivo'}</dd>
              </div>
            </dl>

            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
              Todo vehículo debe pertenecer a un cliente registrado antes de ser agregado al
              sistema.
            </p>
          </>
        ) : null}
      </DetailPanel>
    </div>
  )
}

export default Vehiculos