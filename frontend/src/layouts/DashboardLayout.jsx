import { NavLink, Outlet } from 'react-router-dom'
import { menuItems } from '../constants/menuItems'

function DashboardLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="brand">
          <div>
            <strong>Sistema Taller</strong>
            <small>Wireframe administrativo</small>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'nav-link nav-link-active' : 'nav-link'
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="content-shell">
        <header className="topbar">
          <div>
            <strong>Taller de Refrigeracion Automotriz</strong>
            <span>Prototipo visual de baja fidelidad</span>
          </div>

          <div className="topbar-actions" aria-label="Acciones conceptuales">
            <span className="wire-input">Buscar modulo o registro</span>
            <span className="wire-button">Accion</span>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>

        <footer className="app-footer">
          Sistema de Taller de Refrigeracion Automotriz · Prototipo academico
        </footer>
      </div>
    </div>
  )
}

export default DashboardLayout
