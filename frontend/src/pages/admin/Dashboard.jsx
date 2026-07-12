import { useOutletContext } from 'react-router-dom'
import { Calendar, ClipboardList, DollarSign, Package, Truck } from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import StatCard from '@/components/common/StatCard'
import DataTable from '@/components/common/DataTable'
import { BarChart, LineChart } from '@/components/common/OperationalCharts'
import StatusBadge from '@/components/domain/StatusBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getStockState } from '@/constants/domainStates'
import { useAsyncData } from '@/hooks/useAsyncData'
import { obtenerResumen } from '@/services/dashboardService'
import { formatQuantity } from '@/utils/formatters'

const statIcons = {
  citas: Calendar,
  ordenes: ClipboardList,
  facturar: Truck,
  pago: DollarSign,
  stock: Package,
  ingresos: DollarSign,
}

function Dashboard() {
  const { sucursalId } = useOutletContext()
  const {
    data: resumen,
    isLoading,
    error,
  } = useAsyncData(() => obtenerResumen(sucursalId), [sucursalId])

  if (error) return <ErrorState description={error} />
  if (isLoading || !resumen) return <LoadingSkeleton rows={6} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Inicio"
        title="Resumen del turno"
        description="Prioridades de citas, órdenes y existencias de la sucursal."
      />

      <div className="grid gap-px border-y border-border sm:grid-cols-2 xl:grid-cols-3">
        {resumen.stats.map((stat) => (
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
        <BarChart
          title="Órdenes por estado"
          description="Estado actual de la sucursal"
          data={[
            { label: 'Abiertas', value: 6 },
            { label: 'Diagnóstico', value: 5 },
            { label: 'Reparación', value: 3 },
            { label: 'Facturadas', value: 4 },
          ]}
        />
        <LineChart
          title="Ingresos del período"
          description="Últimos siete días · DOP"
          data={[21000, 28000, 18500, 42500, 31500, 48500, 39000]}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Órdenes recientes</h2>
          <DataTable
            columns={[
              { key: 'numero', label: 'Orden' },
              { key: 'vehiculo', label: 'Vehículo' },
              { key: 'cliente', label: 'Cliente' },
              {
                key: 'estado',
                label: 'Estado',
                render: (row) => <StatusBadge status={row.estado} />,
              },
            ]}
            rows={resumen.ordenesRecientes}
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
            rows={resumen.citasProximas}
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
              { key: 'nombre', label: 'Material' },
              {
                key: 'stockActual',
                label: 'Existencia',
                render: (row) => formatQuantity(row.stockActual, row.unidadMedida),
              },
              {
                key: 'stockMinimo',
                label: 'Mínimo',
                render: (row) => formatQuantity(row.stockMinimo, row.unidadMedida),
              },
              {
                key: 'estado',
                label: 'Estado',
                render: (row) => (
                  <StatusBadge
                    group="stock"
                    status={getStockState(row.stockActual, row.stockMinimo)}
                  />
                ),
              },
            ]}
            rows={resumen.alertasStock}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
