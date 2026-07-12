import { useAsyncData } from '@/hooks/useAsyncData'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'
import { listarServicios } from '@/services/catalogoService'
import { formatCurrency } from '@/utils/formatters'

function Servicios() {
  const { data, isLoading, error } = useAsyncData(() => listarServicios(), [])
  const servicios = data ?? []

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catálogo"
        title="Servicios"
        description="Servicios facturables del taller, con su precio base e impuesto aplicable."
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={[
            { key: 'nombre', label: 'Servicio' },
            { key: 'descripcion', label: 'Descripción' },
            {
              key: 'precioBase',
              label: 'Precio base',
              render: (row) => formatCurrency(row.precioBase),
            },
            {
              key: 'porcentajeImpuesto',
              label: 'ITBIS',
              render: (row) => `${row.porcentajeImpuesto}%`,
            },
            { key: 'duracion', label: 'Duración' },
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
          rows={servicios}
          emptyMessage="Todavía no hay servicios en el catálogo."
        />
      )}
    </div>
  )
}

export default Servicios
