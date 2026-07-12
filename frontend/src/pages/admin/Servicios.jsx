import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { formatCurrency } from '@/utils/formatters'

const servicios = [
  {
    id: 1,
    codigo: 'SRV-001',
    nombre: 'Diagnóstico HVAC',
    precio: formatCurrency(2500),
    duracion: '45 min',
  },
  {
    id: 2,
    codigo: 'SRV-002',
    nombre: 'Recarga de refrigerante',
    precio: formatCurrency(4500),
    duracion: '60 min',
  },
  {
    id: 3,
    codigo: 'SRV-003',
    nombre: 'Detección de fugas',
    precio: formatCurrency(3200),
    duracion: '50 min',
  },
  {
    id: 4,
    codigo: 'SRV-004',
    nombre: 'Limpieza de evaporador',
    precio: formatCurrency(6800),
    duracion: '120 min',
  },
]

function Servicios() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Servicios"
        description="Catálogo base de servicios facturables del taller."
      />
      <DataTable
        columns={[
          { key: 'codigo', label: 'Código' },
          { key: 'nombre', label: 'Servicio' },
          { key: 'precio', label: 'Precio base' },
          { key: 'duracion', label: 'Duración' },
        ]}
        rows={servicios}
      />
    </div>
  )
}

export default Servicios
