import { NavLink, Outlet } from 'react-router-dom'
import { menuItems } from '../constants/menuItems'

function DashboardLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacion principal">
        <div className="brand">
          <span className="brand-mark">TR</span>
          <div>
            <strong>Taller Refrigeracion</strong>
            <small>Gestion automotriz</small>
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
            <strong>Panel administrativo</strong>
            <span>Base inicial para operaciones del taller</span>
          </div>
        </header>

        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
