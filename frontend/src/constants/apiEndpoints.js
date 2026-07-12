/**
 * Rutas que el equipo de backend debe implementar sobre las migraciones actuales.
 * Las pantallas no conocen estas rutas directamente: usan services/.
 */
export const apiEndpoints = {
  appointmentRequests: '/api/v1/solicitudes-cita',
  appointments: '/api/v1/citas',
  clients: '/api/v1/clientes',
  vehicles: '/api/v1/vehiculos',
  workOrders: '/api/v1/ordenes-trabajo',
  diagnostics: '/api/v1/ordenes-trabajo/:id/diagnostico',
  materials: '/api/v1/materiales',
  inventoryMovements: '/api/v1/inventario-movimientos',
  invoices: '/api/v1/facturas',
  users: '/api/v1/usuarios',
  branches: '/api/v1/sucursales',
  // Pendiente: requiere las tablas cotizaciones y cotizacion_detalles.
  // Ver docs/solicitud-bd-cotizaciones.md
  quotes: '/api/v1/cotizaciones',
}

export function endpointWithId(template, id) {
  return template.replace(':id', String(id))
}
