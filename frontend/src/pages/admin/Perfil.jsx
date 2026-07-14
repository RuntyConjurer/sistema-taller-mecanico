import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Building2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import PageHeader from '@/components/common/PageHeader'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Badge } from '@/components/ui/badge'
import { demoRoles } from '@/constants/demoRoles'
import { menuItems } from '@/constants/menuItems'
import { useAsyncData } from '@/hooks/useAsyncData'
import { listarSucursales } from '@/services/catalogoService'
import { obtenerPerfilActual } from '@/services/perfilService'

function obtenerIniciales(nombre = '') {
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte.charAt(0))
    .join('')
    .toUpperCase()

  return iniciales || 'US'
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 wrap-break-words text-sm font-medium">
          {value || 'No especificado'}
        </p>
      </div>
    </div>
  )
}

function Perfil() {
  const { role, sucursalId } = useOutletContext()

  const { data, isLoading, error } = useAsyncData(async () => {
    const [perfil, sucursales] = await Promise.all([
      obtenerPerfilActual(role),
      listarSucursales(),
    ])

    return {
      perfil,
      sucursales,
    }
  }, [role])

  const perfil = data?.perfil ?? null
  const sucursales = data?.sucursales ?? []

  const rolActual = demoRoles[role]?.label ?? role

  const sucursalAsignada = sucursales.find(
    (sucursal) => sucursal.id === perfil?.idSucursal,
  )

  const sucursalActiva = sucursales.find(
    (sucursal) => sucursal.id === sucursalId,
  )

  const modulosPermitidos = useMemo(
    () =>
      menuItems.filter(
        (item) =>
          Array.isArray(item.roles) && item.roles.includes(role),
      ),
    [role],
  )

  if (error) {
    return <ErrorState description={error} />
  }

  if (isLoading || !perfil) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Cuenta"
        title="Mi perfil"
        description="Información de la cuenta, rol asignado y permisos disponibles en el sistema."
      />

      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-muted/40 p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {obtenerIniciales(perfil.nombre)}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {perfil.nombre}
                </h2>

                <Badge variant={perfil.activo ? 'success' : 'muted'}>
                  {perfil.activo ? 'Cuenta activa' : 'Cuenta inactiva'}
                </Badge>
              </div>

              <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                <ShieldCheck
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                <span>{rolActual}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <InfoItem
            icon={Mail}
            label="Correo electrónico"
            value={perfil.email}
          />

          <InfoItem
            icon={Phone}
            label="Teléfono"
            value={perfil.telefono}
          />

          <InfoItem
            icon={Building2}
            label="Sucursal asignada"
            value={sucursalAsignada?.nombre}
          />

          <InfoItem
            icon={MapPin}
            label="Sucursal activa"
            value={sucursalActiva?.nombre}
          />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" aria-hidden="true" />
          </div>

          <div>
            <h2 className="text-lg font-bold">
              Módulos disponibles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Se muestran según el rol activo de la sesión.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {modulosPermitidos.map((modulo) => (
            <div
              key={modulo.path}
              className="rounded-lg border border-border p-4"
            >
              <p className="font-semibold">{modulo.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {modulo.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Perfil