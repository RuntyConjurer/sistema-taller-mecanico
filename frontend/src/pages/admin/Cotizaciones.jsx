import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cotizaciones } from '@/data/mocks/citas.mock'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/utils/formatters'
import { useState } from 'react'
import DetailPanel from '@/components/common/DetailPanel'

const estadoVariant = {
  Borrador: 'muted',
  Enviada: 'info',
  Aprobada: 'success',
  Rechazada: 'danger',
}

function Cotizaciones() {
  const [selected, setSelected] = useState(null)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Comercial"
        title="Cotizaciones"
        description="Propuestas de servicios y materiales antes de abrir una orden de trabajo."
        actionLabel="Nueva cotización"
        actionTo="/app/cotizaciones"
      />

      <DataTable
        columns={[
          { key: 'numero', label: 'Número' },
          { key: 'cliente', label: 'Cliente' },
          { key: 'vehiculo', label: 'Vehículo' },
          { key: 'total', label: 'Total', render: (row) => formatCurrency(row.total) },
          {
            key: 'estado',
            label: 'Estado',
            render: (row) => (
              <Badge variant={estadoVariant[row.estado] || 'muted'}>{row.estado}</Badge>
            ),
          },
          { key: 'vigencia', label: 'Vigencia' },
        ]}
        rows={cotizaciones}
        selectedId={selected?.id}
        onRowSelect={setSelected}
      />
      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Cotización"
        subtitle={selected?.numero}
      >
        <p className="text-sm">
          {selected?.cliente} · {selected?.vehiculo}
        </p>
        <p className="mt-5 technical-value text-lg">
          {selected ? formatCurrency(selected.total) : ''}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">Estado: {selected?.estado}</p>
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Editor y conversión a OT son demostrativos.
        </p>
      </DetailPanel>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Editor maestro-detalle (vista previa)</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Enviar
            </Button>
            <Button size="sm">Convertir a OT</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-border p-4 text-sm">
              <p className="font-medium">Cliente: María López</p>
              <p className="text-muted-foreground">Vehículo: Toyota Corolla · A123456</p>
            </div>
            <div className="rounded-lg border border-border p-4 text-sm">
              <p className="font-medium">Totales estimados</p>
              <p className="text-muted-foreground">
                Subtotal {formatCurrency(11000)} · ITBIS incluido · Total {formatCurrency(12500)}
              </p>
            </div>
          </div>
          <DataTable
            columns={[
              { key: 'linea', label: 'Descripción' },
              { key: 'cantidad', label: 'Cant.' },
              { key: 'precio', label: 'Precio' },
              { key: 'total', label: 'Total' },
            ]}
            rows={[
              {
                id: 1,
                linea: 'Diagnóstico HVAC',
                cantidad: 1,
                precio: formatCurrency(2500),
                total: formatCurrency(2500),
              },
              {
                id: 2,
                linea: 'Recarga R-134a',
                cantidad: 1,
                precio: formatCurrency(4500),
                total: formatCurrency(4500),
              },
              {
                id: 3,
                linea: 'Reparación fuga menor',
                cantidad: 1,
                precio: formatCurrency(4000),
                total: formatCurrency(4000),
              },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Cotizaciones
