import { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DetailPanel from '@/components/common/DetailPanel'
import { listarClientes } from '@/services/clientesService'

function Clientes() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')
  useEffect(() => {
    void Promise.resolve().then(async () => {
      try {
        setClientes(await listarClientes())
      } catch (loadError) {
        setError(loadError.message || 'No fue posible cargar los clientes.')
      }
    })
  }, [])
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return clientes
    return clientes.filter(
      (item) =>
        item.nombre.toLowerCase().includes(term) ||
        item.identificacion.toLowerCase().includes(term) ||
        item.telefono.includes(term),
    )
  }, [clientes, query])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Gestión de clientes"
        title="Clientes"
        description="Registro, consulta y ficha de clientes del taller."
        action={
          <Button
            type="button"
            onClick={() => window.alert('Formulario visual — sin persistencia.')}
          >
            Nuevo cliente
          </Button>
        }
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
          <DataTable
            columns={[
              { key: 'nombre', label: 'Cliente' },
              { key: 'identificacion', label: 'Identificación' },
              { key: 'telefono', label: 'Teléfono' },
              { key: 'vehiculos', label: 'Vehículos' },
              {
                key: 'estado',
                label: 'Estado',
                render: (row) => <Badge variant="success">{row.estado}</Badge>,
              },
            ]}
            rows={filtered}
            selectedId={selected?.id}
            onRowSelect={setSelected}
            emptyMessage="No hay clientes que coincidan con la búsqueda."
          />
        </CardContent>
      </Card>
      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Ficha de cliente"
        subtitle={selected?.nombre}
      >
        <p className="technical-value">{selected?.identificacion}</p>
        <p className="mt-4 text-sm">{selected?.telefono}</p>
        <div className="mt-8 border-y border-border py-4 text-sm">
          <b>Vehículos vinculados</b>
          <p className="mt-2 text-muted-foreground">
            Consulta el historial técnico y las órdenes desde el vehículo seleccionado.
          </p>
        </div>
      </DetailPanel>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Ficha de cliente (vista previa)</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="datos">
            <TabsList>
              <TabsTrigger value="datos">Datos</TabsTrigger>
              <TabsTrigger value="vehiculos">Vehículos</TabsTrigger>
              <TabsTrigger value="ordenes">Órdenes</TabsTrigger>
              <TabsTrigger value="facturas">Facturas</TabsTrigger>
            </TabsList>
            <TabsContent
              value="datos"
              className="rounded-lg border border-border p-4 text-sm text-muted-foreground"
            >
              Información de contacto, identificación y notas del cliente seleccionado.
            </TabsContent>
            <TabsContent
              value="vehiculos"
              className="rounded-lg border border-border p-4 text-sm text-muted-foreground"
            >
              Vehículos asociados con placa, refrigerante recomendado y acceso al historial.
            </TabsContent>
            <TabsContent
              value="ordenes"
              className="rounded-lg border border-border p-4 text-sm text-muted-foreground"
            >
              Órdenes de trabajo vinculadas al cliente con estados y fechas.
            </TabsContent>
            <TabsContent
              value="facturas"
              className="rounded-lg border border-border p-4 text-sm text-muted-foreground"
            >
              Facturas emitidas, pagos aplicados y balances pendientes.
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default Clientes
