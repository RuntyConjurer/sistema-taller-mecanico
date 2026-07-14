import { Route, Routes } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout from '../layouts/AuthLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import RequireSession from './RequireSession'
import Home from '../pages/public/Home'
import Proceso from '../pages/public/Proceso'
import Nosotros from '../pages/public/Nosotros'
import Contacto from '../pages/public/Contacto'
import AgendarCita from '../pages/public/AgendarCita'
import ServiciosPublicos from '../pages/public/ServiciosPublicos'
import ServicioDetalle from '../pages/public/ServicioDetalle'
import Sucursal from '../pages/public/Sucursal'
import NotFound from '../pages/public/NotFound'
import Login from '../pages/auth/Login'
import Dashboard from '../pages/admin/Dashboard'
import Citas from '../pages/admin/Citas'
import Cotizaciones from '../pages/admin/Cotizaciones'
import Clientes from '../pages/admin/Clientes'
import Diagnosticos from '../pages/admin/Diagnosticos'
import Facturacion from '../pages/admin/Facturacion'
import HistorialTecnico from '../pages/admin/HistorialTecnico'
import Inventario from '../pages/admin/Inventario'
import OrdenesTrabajo from '../pages/admin/OrdenesTrabajo'
import Refrigerantes from '../pages/admin/Refrigerantes'
import Reportes from '../pages/admin/Reportes'
import Servicios from '../pages/admin/Servicios'
import Usuarios from '../pages/admin/Usuarios'
import Perfil from '../pages/admin/Perfil'
import Vehiculos from '../pages/admin/Vehiculos'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="servicios" element={<ServiciosPublicos />} />
        <Route path="servicios/:serviceId" element={<ServicioDetalle />} />
        <Route path="agendar-cita" element={<AgendarCita />} />
        <Route path="sucursal/:branchId" element={<Sucursal />} />
        <Route path="proceso" element={<Proceso />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="contacto" element={<Contacto />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
      </Route>

      <Route
        path="app"
        element={
          <RequireSession>
            <DashboardLayout />
          </RequireSession>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="ordenes-trabajo" element={<OrdenesTrabajo />} />
        <Route path="diagnosticos" element={<Diagnosticos />} />
        <Route path="servicios" element={<Servicios />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="refrigerantes" element={<Refrigerantes />} />
        <Route path="facturacion" element={<Facturacion />} />
        <Route path="citas" element={<Citas />} />
        <Route path="cotizaciones" element={<Cotizaciones />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="historial-tecnico" element={<HistorialTecnico />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
