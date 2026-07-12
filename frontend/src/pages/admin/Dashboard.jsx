import {
  Calendar,
  ClipboardList,
  DollarSign,
  Package,
  Truck,
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import StatCard from '@/components/common/StatCard'
import DataTable from '@/components/common/DataTable'
import { BarChart, LineChart } from '@/components/common/OperationalCharts'
import StatusBadge from '@/components/domain/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  dashboardStats,
  recentOrdenes,
  stockAlerts,
  upcomingCitas,
} from '@/data/mocks/dashboard.mock'

const statIcons = {
  citas: Calendar,
  ordenes: ClipboardList,
  facturar: Truck,
  pago: DollarSign,
  stock: Package,
  ingresos: DollarSign,
}

function Dashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inicio"
        title="Resumen del turno"
        description="Prioridades de citas, órdenes y existencias de la sucursal."
      />

      <Card>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="dash-desde">Desde</Label>
            <Input id="dash-desde" type="date" defaultValue="2026-07-01" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dash-hasta">Hasta</Label>
            <Input id="dash-hasta" type="date" defaultValue="2026-07-12" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="dash-sucursal">Sucursal (vista)</Label>
            <div className="flex gap-2">
              <Input id="dash-sucursal" defaultValue="Sucursal Churchill" readOnly />
              <Button type="button" variant="secondary">
                Aplicar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-px border-y border-border sm:grid-cols-2 xl:grid-cols-3">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.key}
            title={stat.title}
            value={stat.value}
            hint={stat.hint}
            tone={stat.tone}
            icon={statIcons[stat.key]}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart title="Órdenes por estado" description="Estado actual de la sucursal" data={[{ label: 'Abiertas', value: 6 }, { label: 'Diagnóstico', value: 5 }, { label: 'Reparación', value: 3 }, { label: 'Facturadas', value: 4 }]} />
        <LineChart title="Ingresos del período" description="Últimos siete días · DOP" data={[21000, 28000, 18500, 42500, 31500, 48500, 39000]} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Órdenes recientes</h2>
          <DataTable
            columns={[
              { key: 'numero', label: 'Orden' },
              { key: 'vehiculo', label: 'Vehículo' },
              { key: 'cliente', label: 'Cliente' },
              { key: 'estado', label: 'Estado', render: (row) => <StatusBadge status={row.estado} /> },
            ]}
            rows={recentOrdenes}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Citas próximas</h2>
          <DataTable
            columns={[
              { key: 'hora', label: 'Hora' },
              { key: 'cliente', label: 'Cliente' },
              { key: 'vehiculo', label: 'Vehículo' },
              { key: 'motivo', label: 'Motivo' },
            ]}
            rows={upcomingCitas}
          />
        </section>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertas de inventario</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { key: 'producto', label: 'Producto' },
              { key: 'existencia', label: 'Existencia' },
              { key: 'minimo', label: 'Mínimo' },
            ]}
            rows={stockAlerts}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
