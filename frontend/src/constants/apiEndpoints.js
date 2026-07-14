/**
 * Rutas que el backend debe exponer. Las pantallas nunca las usan directamente:
 * pasan por services/, y cada service decide si pide los datos aquí o a los mocks.
 *
 * Convenciones acordadas con el backend:
 *   - Respuesta correcta: { "data": ... }
 *   - Respuesta de error:  { "error": { "code", "message", "fieldErrors" } }
 *   - Los errores de los triggers de PostgreSQL (P0001 a P0004) llegan traducidos
 *     a ese formato, con el mensaje ya listo para mostrar al usuario.
 */
export const apiEndpoints = {
  sessions: '/api/v1/sesiones',
  health: '/api/v1/health',
  ready: '/api/v1/ready',
  appointmentRequests: '/api/v1/solicitudes-cita',
  appointments: '/api/v1/citas',
  clients: '/api/v1/clientes',
  vehicles: '/api/v1/vehiculos',
  workOrders: '/api/v1/ordenes-trabajo',
  diagnostics: '/api/v1/ordenes-trabajo/:id/diagnostico',
  services: '/api/v1/servicios',
  materials: '/api/v1/materiales',
  refrigerants: '/api/v1/refrigerantes',
  inventoryMovements: '/api/v1/inventario-movimientos',
  invoices: '/api/v1/facturas',
  users: '/api/v1/usuarios',
  profile: '/api/v1/perfil',
  branches: '/api/v1/sucursales',
  dashboard: '/api/v1/dashboard',
  reports: '/api/v1/reportes',
  // Pendiente: requiere las tablas cotizaciones y cotizacion_detalles, solicitadas
  // al equipo de base de datos.
  quotes: '/api/v1/cotizaciones',
}

export function endpointWithId(template, id) {
  const value = String(id)
  return template.includes(':id') ? template.replace(':id', value) : `${template}/${value}`
}
