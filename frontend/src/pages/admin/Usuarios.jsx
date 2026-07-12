import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import DetailPanel from '@/components/common/DetailPanel'

const usuarios = [
  { id: 1, nombre: 'Laura Peña', rol: 'Administrador', sucursal: 'Churchill', estado: 'Activo' },
  { id: 2, nombre: 'Juan Méndez', rol: 'Técnico', sucursal: 'Churchill', estado: 'Activo' },
  { id: 3, nombre: 'Carmen Núñez', rol: 'Recepción', sucursal: 'Santiago', estado: 'Activo' },
  { id: 4, nombre: 'Miguel Reyes', rol: 'Caja', sucursal: 'Churchill', estado: 'Inactivo' },
]

function Usuarios() {
  const [selected, setSelected] = useState(null)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Seguridad"
        title="Usuarios"
        description="Gestión de accesos, roles, permisos y sucursales autorizadas."
        actionLabel="Nuevo usuario"
        actionTo="/app/usuarios"
      />
      <DataTable
        columns={[
          { key: 'nombre', label: 'Usuario' },
          { key: 'rol', label: 'Rol' },
          { key: 'sucursal', label: 'Sucursal' },
          { key: 'estado', label: 'Estado', render: (row) => <Badge variant={row.estado === 'Activo' ? 'success' : 'muted'}>{row.estado}</Badge> },
        ]}
        rows={usuarios}
        selectedId={selected?.id}
        onRowSelect={setSelected}
      />
      <DetailPanel open={Boolean(selected)} onClose={() => setSelected(null)} title="Acceso de usuario" subtitle={selected?.nombre}>
        <p className="text-sm">Rol: {selected?.rol}</p><p className="mt-2 text-sm">Sucursal: {selected?.sucursal}</p><p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">Los permisos son solo visuales en esta demostración.</p>
      </DetailPanel>
    </div>
  )
}

export default Usuarios
