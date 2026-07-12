import { useEffect, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import DetailPanel from '@/components/common/DetailPanel'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'
import { demoRoles } from '@/constants/demoRoles'
import { listarSucursales, listarUsuarios } from '@/services/usuariosService'

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [sucursales, setSucursales] = useState([])
  const [selected, setSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const [users, branches] = await Promise.all([listarUsuarios(), listarSucursales()])
        setUsuarios(users)
        setSucursales(branches)
      } catch (loadError) {
        setError(loadError.message || 'No fue posible cargar los usuarios.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadData()
  }, [])

  const nombreSucursal = (id) => sucursales.find((item) => item.id === id)?.nombre || '—'
  const nombreRol = (code) => demoRoles[code]?.label || code

  if (error) return <ErrorState description={error} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Seguridad"
        title="Usuarios"
        description="Accesos del personal, roles asignados y sucursal de trabajo."
      />

      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={[
            { key: 'nombre', label: 'Usuario' },
            { key: 'email', label: 'Correo' },
            {
              key: 'roles',
              label: 'Roles',
              render: (row) => row.roles.map(nombreRol).join(' · '),
            },
            {
              key: 'idSucursal',
              label: 'Sucursal',
              render: (row) => nombreSucursal(row.idSucursal),
            },
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
          rows={usuarios}
          selectedId={selected?.id}
          onRowSelect={setSelected}
        />
      )}

      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Acceso de usuario"
        subtitle={selected?.nombre}
      >
        {selected ? (
          <>
            <div className="space-y-2 text-sm">
              <p>Correo: {selected.email}</p>
              <p>Teléfono: {selected.telefono}</p>
              <p>Sucursal: {nombreSucursal(selected.idSucursal)}</p>
              <p>Roles: {selected.roles.map(nombreRol).join(' · ')}</p>
            </div>
            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
              El rol solo decide qué módulos se muestran. La base de datos guarda la contraseña como
              password_hash y el backend deberá comprobar los permisos en cada petición.
            </p>
          </>
        ) : null}
      </DetailPanel>
    </div>
  )
}

export default Usuarios
