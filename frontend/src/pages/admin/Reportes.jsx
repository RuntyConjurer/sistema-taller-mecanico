import { useOutletContext } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import { BarChart, LineChart } from '@/components/common/OperationalCharts'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { useAsyncData } from '@/hooks/useAsyncData'
import { obtenerReportes } from '@/services/reportesService'

function Reportes() {
  const { sucursalId } = useOutletContext()
  const { data, isLoading, error } = useAsyncData(
    () => obtenerReportes({ sucursalId }),
    [sucursalId],
  )

  if (error) return <ErrorState description={error} />
  if (isLoading || !data) return <LoadingSkeleton rows={4} />

  const ordenes = (data.ordenes || []).map((item) => ({
    label: item.label || item.estado,
    value: Number(item.value ?? item.cantidad ?? item.total ?? 0),
  }))
  const ingresos = (data.ingresos || []).map((item) =>
    Number(typeof item === 'number' ? item : item.value ?? item.total ?? item.ingresos ?? 0),
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Indicadores"
        title="Reportes"
        description="Lectura operativa y financiera de la sucursal activa."
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Órdenes por estado"
          description="Distribución para el período consultado"
          data={ordenes}
        />
        <LineChart
          title="Ingresos por período"
          description="Últimos siete días · DOP"
          data={ingresos}
        />
      </div>
    </div>
  )
}

export default Reportes
