import { Link, NavLink, Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { brand } from '@/constants/brand'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AppLogo from '@/components/brand/AppLogo'

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Servicios', to: '/servicios' },
  { label: 'Proceso', to: '/proceso' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/contacto' },
]

function PublicNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card">
      <div className="page-container flex h-16 items-center justify-between gap-4">
        <AppLogo />

        <nav className="hidden items-center gap-6 md:flex" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                cn('text-sm font-medium transition-colors hover:text-primary', isActive ? 'text-primary' : 'text-muted-foreground')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Acceso staff</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/agendar-cita">Agendar cita</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={open}
          aria-controls="navegacion-movil"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div id="navegacion-movil" className="border-t border-border bg-card px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Navegación móvil">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className="text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            <Button asChild className="mt-2">
              <Link to="/agendar-cita" onClick={() => setOpen(false)}>
                Agendar cita
              </Link>
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="page-container flex flex-col gap-6 py-8 text-sm text-muted-foreground md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-semibold text-foreground">{brand.name}</p>
          <p>{brand.address}</p>
          <p>{brand.phone}</p>
        </div>
        <nav className="flex flex-wrap gap-4" aria-label="Enlaces del pie">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
          <Link to="/login" className="transition-colors hover:text-primary">
            Acceso staff
          </Link>
        </nav>
        <p>SGTRA · Prototipo académico · {new Date().getFullYear()}</p>
      </div>
    </footer>
  )
}

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-white">
        Saltar al contenido
      </a>
      <PublicNavbar />
      <main id="contenido" className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
