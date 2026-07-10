import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import Citas from '../pages/Citas'
import Clientes from '../pages/Clientes'
import Dashboard from '../pages/Dashboard'
import Diagnosticos from '../pages/Diagnosticos'
import Facturacion from '../pages/Facturacion'
import HistorialTecnico from '../pages/HistorialTecnico'
import Inventario from '../pages/Inventario'
import OrdenesTrabajo from '../pages/OrdenesTrabajo'
import Refrigerantes from '../pages/Refrigerantes'
import Reportes from '../pages/Reportes'
import Servicios from '../pages/Servicios'
import Usuarios from '../pages/Usuarios'
import Vehiculos from '../pages/Vehiculos'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="ordenes-trabajo" element={<OrdenesTrabajo />} />
        <Route path="diagnosticos" element={<Diagnosticos />} />
        <Route path="servicios" element={<Servicios />} />
        <Route path="inventario" element={<Inventario />} />
        <Route path="refrigerantes" element={<Refrigerantes />} />
        <Route path="facturacion" element={<Facturacion />} />
        <Route path="citas" element={<Citas />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="historial-tecnico" element={<HistorialTecnico />} />
        <Route path="reportes" element={<Reportes />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
