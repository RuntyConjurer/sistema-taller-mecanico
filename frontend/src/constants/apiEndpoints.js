/**
 * Rutas que el backend debe exponer. Las pantallas nunca las usan directamente:
 * pasan por services/, y cada service decide si pide los datos aquí o a los mocks.
 *
 * El contrato completo, con ejemplos de petición y respuesta, está en
 * docs/integracion-backend.md.
 */
export const apiEndpoints = {
  appointmentRequests: '/api/v1/solicitudes-cita',
  appointments: '/api/v1/citas',
  clients: '/api/v1/clientes',
  vehicles: '/api/v1/vehiculos',
  workOrders: '/api/v1/ordenes-trabajo',
  diagnostics: '/api/v1/ordenes-trabajo/:id/diagnostico',
  services: '/api/v1/servicios',
  materials: '/api/v1/materiales',
  inventoryMovements: '/api/v1/inventario-movimientos',
  invoices: '/api/v1/facturas',
  users: '/api/v1/usuarios',
  branches: '/api/v1/sucursales',
  dashboard: '/api/v1/dashboard',
  // Pendiente: requiere las tablas cotizaciones y cotizacion_detalles.
  // Ver docs/solicitud-bd-cotizaciones.md
  quotes: '/api/v1/cotizaciones',
}

export function endpointWithId(template, id) {
  return template.replace(':id', String(id))
}
