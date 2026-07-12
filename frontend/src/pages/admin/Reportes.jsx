import PageHeader from '@/components/common/PageHeader'
import { BarChart, LineChart } from '@/components/common/OperationalCharts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function Reportes() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Indicadores"
        title="Reportes"
        description="Reportes operativos, técnicos, de inventario y financieros."
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label>Tipo de reporte</Label>
            <Input defaultValue="Órdenes por estado" />
          </div>
          <div className="space-y-2">
            <Label>Desde</Label>
            <Input type="date" defaultValue="2026-07-01" />
          </div>
          <div className="space-y-2">
            <Label>Hasta</Label>
            <Input type="date" defaultValue="2026-07-12" />
          </div>
          <div className="flex items-end">
            <Button className="w-full">Generar</Button>
          </div>
        </CardContent>
      </Card>

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

      <div className="flex gap-2">
        <Button variant="outline" disabled>
          Exportar CSV
        </Button>
        <Button variant="outline" disabled>
          Exportar PDF
        </Button>
      </div>
    </div>
  )
}

export default Reportes
