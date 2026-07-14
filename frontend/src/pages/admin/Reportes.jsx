import PageHeader from '@/components/common/PageHeader'
import { BarChart, LineChart } from '@/components/common/OperationalCharts'
import { Button } from '@/components/ui/button'

function Reportes() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Indicadores"
        title="Reportes"
        description="Reportes operativos, técnicos, de inventario y financieros."
      />

      <p className="border-l-2 border-primary bg-muted p-4 text-sm text-muted-foreground">
        Las cifras que se muestran son de demostración. Los reportes definitivos saldrán de las
        vistas que ya existen en PostgreSQL: vw_ordenes_trabajo_resumen para la operación,
        vw_estado_inventario para las existencias y vw_reporte_ingresos_pagos para el cuadre de
        caja. El frontend solo tendrá que pedirlas al backend y dibujarlas.
      </p>

      <div className="grid gap-4 xl:grid-cols-2">
        <BarChart
          title="Órdenes por estado"
          description="Distribución para el período seleccionado"
          data={[
            { label: 'Abiertas', value: 18 },
            { label: 'Diagnóstico', value: 11 },
            { label: 'Reparación', value: 9 },
            { label: 'Facturadas', value: 14 },
          ]}
        />
        <LineChart
          title="Ingresos por período"
          description="Últimos siete días · DOP"
          data={[22000, 34000, 27500, 41000, 49500, 43000, 58000]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled
          title="Disponible cuando el backend exponga los reportes"
        >
          Exportar CSV
        </Button>
        <Button
          variant="outline"
          disabled
          title="Disponible cuando el backend exponga los reportes"
        >
          Exportar PDF
        </Button>
        <span className="text-xs text-muted-foreground">
          La exportación requiere los datos reales del backend.
        </span>
      </div>
    </div>
  )
}

export default Reportes
