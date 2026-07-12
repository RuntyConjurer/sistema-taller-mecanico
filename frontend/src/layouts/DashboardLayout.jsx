import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import {
  Bell,
  Menu,
  Search,
  UserRound,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { brand } from '@/constants/brand'
import { menuItems } from '@/constants/menuItems'
import { sucursales } from '@/data/mocks/dashboard.mock'
import { cn } from '@/lib/utils'
import Breadcrumb from '@/components/common/Breadcrumb'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppLogo from '@/components/brand/AppLogo'
import { demoRoles } from '@/constants/demoRoles'
import {
  BarChart3,
  Calendar,
  Car,
  ClipboardList,
  FileText,
  History,
  LayoutDashboard,
  Package,
  Receipt,
  Stethoscope,
  Users,
  Wrench,
} from 'lucide-react'

const iconMap = {
  '/app': LayoutDashboard,
  '/app/citas': Calendar,
  '/app/cotizaciones': FileText,
  '/app/ordenes-trabajo': ClipboardList,
  '/app/diagnosticos': Stethoscope,
  '/app/clientes': Users,
  '/app/vehiculos': Car,
  '/app/historial-tecnico': History,
  '/app/inventario': Package,
  '/app/refrigerantes': Package,
  '/app/servicios': Wrench,
  '/app/facturacion': Receipt,
  '/app/reportes': BarChart3,
  '/app/usuarios': Users,
}

function buildMenuGroups(items) {
  return ['Operación', 'Clientes', 'Inventario', 'Administración'].map((label) => ({
    label,
    items: items
    .filter((item) => item.group === label)
    .map((item) => ({
      ...item,
      icon: iconMap[item.path] || LayoutDashboard,
      end: item.path === '/app',
    })),
  })).filter((group) => group.items.length)
}

function resolveBreadcrumbs(pathname) {
  if (pathname === '/app' || pathname === '/app/') {
    return [{ label: 'Dashboard' }]
  }
  const current = menuItems.find((item) => item.path === pathname)
  return current ? [{ label: current.group }, { label: current.label }] : [{ label: 'Panel' }]
}

function SidebarNav({ groups, onNavigate }) {
  return (
    <nav id="navegacion-admin" className="flex-1 space-y-6 overflow-y-auto p-4" aria-label="Módulos del sistema">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">{group.label}</p>
          <div className="space-y-1">
            {group.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150',
                    isActive
                      ? 'bg-accent text-foreground'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                  )
                }
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function DashboardLayout() {
  const [sucursal, setSucursal] = useState(sucursales[0].id)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const role = window.sessionStorage.getItem('sgtra-demo-role') || 'RECEPCION'
  const activeRole = demoRoles[role] || demoRoles.RECEPCION
  const visibleItems = useMemo(() => menuItems.filter((item) => item.roles.includes(role)), [role])
  const menuGroups = useMemo(() => buildMenuGroups(visibleItems), [visibleItems])
  const breadcrumbs = useMemo(() => resolveBreadcrumbs(location.pathname), [location.pathname])
  const sucursalActiva = sucursales.find((item) => item.id === sucursal)
  const isAllowed = location.pathname === '/app' || visibleItems.some((item) => item.path === location.pathname)

  useEffect(() => {
    function closeOnEscape(event) { if (event.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <a
        href="#contenido-admin"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-white"
      >
        Saltar al contenido
      </a>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-700 bg-foreground text-white transition-transform duration-200 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-700 p-5">
          <AppLogo to="/app" compact inverse />
          <button
            type="button"
            className="rounded p-2 text-slate-300 hover:bg-slate-800 lg:hidden"
            aria-label="Cerrar navegación"
            onClick={() => setMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarNav groups={menuGroups} onNavigate={() => setMobileOpen(false)} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border bg-card">
          <div className="flex flex-col gap-4 px-4 py-4 lg:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="rounded-md border border-border p-2 text-muted-foreground hover:bg-muted lg:hidden"
                  aria-label="Abrir navegación"
                  aria-expanded={mobileOpen}
                  aria-controls="navegacion-admin"
                  onClick={() => setMobileOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div>
                  <p className="font-semibold">{brand.name}</p>
                  <p className="text-sm text-muted-foreground">Taller de refrigeración automotriz</p>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center lg:max-w-3xl lg:justify-end">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Buscar cliente, placa u orden..." aria-label="Búsqueda global" />
                </div>
                <select
                  className="h-10 rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={sucursal}
                  onChange={(event) => setSucursal(Number(event.target.value))}
                  aria-label="Sucursal activa"
                >
                  {sucursales.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nombre}
                    </option>
                  ))}
                </select>
                <Button type="button" variant="outline" size="icon" aria-label="Notificaciones">
                  <Bell className="h-4 w-4" />
                </Button>
                <div className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
                  <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span>{activeRole.name}</span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">Salir</Link>
                </Button>
              </div>
            </div>
            <Breadcrumb items={breadcrumbs} />
          </div>
        </header>

        <main id="contenido-admin" className="flex-1 p-4 lg:p-6">
          {isAllowed ? <Outlet /> : <section className="border border-border bg-card p-6"><p className="eyebrow">Acceso restringido</p><h1 className="mt-2 text-2xl font-bold">Este módulo no corresponde a tu rol de demostración</h1><p className="mt-3 max-w-xl text-muted-foreground">Inicia sesión con Administración o el rol operativo adecuado. Esta restricción es solo visual; el backend debe validar permisos reales.</p></section>}
        </main>

        <footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground lg:px-6">
          {brand.shortName} · v0.1 prototipo · {activeRole.label} demo · Sucursal {sucursalActiva?.codigo}
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout
