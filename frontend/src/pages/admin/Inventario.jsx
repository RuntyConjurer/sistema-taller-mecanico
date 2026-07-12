import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { productos, movimientos } from '@/data/mocks/inventario.mock'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import DetailPanel from '@/components/common/DetailPanel'

function Inventario() {
  const [selected, setSelected] = useState(null)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Control de existencias"
        title="Inventario"
        description="Productos, existencias por sucursal, movimientos y alertas de stock mínimo."
        actionLabel="Nuevo producto"
        actionTo="/app/inventario"
      />

      <Tabs defaultValue="productos">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="existencias">Existencias</TabsTrigger>
          <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>
        <TabsContent value="productos">
          <DataTable
            columns={[
              { key: 'codigo', label: 'Código' },
              { key: 'nombre', label: 'Producto' },
              { key: 'categoria', label: 'Categoría' },
              { key: 'existencia', label: 'Existencia' },
              { key: 'minimo', label: 'Mínimo' },
            ]}
            rows={productos}
            selectedId={selected?.id}
            onRowSelect={setSelected}
          />
        </TabsContent>
        <TabsContent value="existencias">
          <DataTable
            columns={[
              { key: 'nombre', label: 'Producto' },
              { key: 'existencia', label: 'Existencia actual' },
              { key: 'minimo', label: 'Stock mínimo' },
            ]}
            rows={productos}
          />
        </TabsContent>
        <TabsContent value="movimientos">
          <DataTable
            columns={[
              { key: 'fecha', label: 'Fecha' },
              { key: 'producto', label: 'Producto' },
              { key: 'tipo', label: 'Tipo' },
              { key: 'cantidad', label: 'Cantidad' },
              { key: 'motivo', label: 'Referencia' },
            ]}
            rows={movimientos}
          />
        </TabsContent>
        <TabsContent value="alertas">
          <DataTable
            columns={[
              { key: 'nombre', label: 'Producto' },
              { key: 'existencia', label: 'Existencia' },
              { key: 'minimo', label: 'Mínimo' },
              {
                key: 'estado',
                label: 'Estado',
                render: (row) => {
                  const low = parseFloat(row.existencia) < parseFloat(row.minimo)
                  return (
                    <Badge variant={low ? 'warning' : 'success'}>
                      {low ? 'Bajo mínimo' : 'OK'}
                    </Badge>
                  )
                },
              },
            ]}
            rows={productos}
          />
        </TabsContent>
      </Tabs>
      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detalle de existencias"
        subtitle={selected?.nombre}
      >
        <p className="technical-value">{selected?.codigo}</p>
        <p className="mt-5 text-sm">Existencia: {selected?.existencia}</p>
        <p className="mt-2 text-sm">Mínimo: {selected?.minimo}</p>
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Los ajustes de stock requieren integración con el backend.
        </p>
      </DetailPanel>
    </div>
  )
}

export default Inventario
