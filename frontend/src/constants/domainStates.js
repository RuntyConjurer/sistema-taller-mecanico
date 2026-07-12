// Los códigos coinciden con los CHECK constraints de PostgreSQL. La interfaz solo
// los traduce a español; nunca inventa estados propios.
const appointmentStates = {
  PROGRAMADA: { label: 'Programada', tone: 'info' },
  CONFIRMADA: { label: 'Confirmada', tone: 'success' },
  CANCELADA: { label: 'Cancelada', tone: 'danger' },
  COMPLETADA: { label: 'Completada', tone: 'muted' },
  NO_ASISTIO: { label: 'No asistió', tone: 'warning' },
}

const invoiceStates = {
  PENDIENTE: { label: 'Pendiente', tone: 'warning' },
  PAGADA: { label: 'Pagada', tone: 'success' },
  ANULADA: { label: 'Anulada', tone: 'danger' },
}

const stockStates = {
  AGOTADO: { label: 'Agotado', tone: 'danger' },
  REORDEN_NECESARIA: { label: 'Reorden necesaria', tone: 'warning' },
  STOCK_OPTIMO: { label: 'Stock óptimo', tone: 'success' },
}

// Cotizaciones es una extensión propuesta (ver docs/solicitud-bd-cotizaciones.md).
// Los códigos se definen aquí con el mismo estilo que el resto para que, cuando la
// tabla exista, el CHECK constraint pueda copiarlos tal cual.
const quoteStates = {
  BORRADOR: { label: 'Borrador', tone: 'muted' },
  ENVIADA: { label: 'Enviada', tone: 'info' },
  APROBADA: { label: 'Aprobada', tone: 'success' },
  RECHAZADA: { label: 'Rechazada', tone: 'danger' },
  VENCIDA: { label: 'Vencida', tone: 'warning' },
}

const stateGroups = {
  cita: appointmentStates,
  factura: invoiceStates,
  stock: stockStates,
  cotizacion: quoteStates,
}

export function getStateMeta(group, value) {
  const states = stateGroups[group] || invoiceStates
  return states[value] || { label: value || 'Sin estado', tone: 'muted' }
}

// Réplica exacta del CASE de la vista vw_estado_inventario (database/views/004).
// El cálculo vive en la base de datos; aquí se repite solo para que la demo con
// mocks muestre el mismo resultado que mostrará la API.
export function getStockState(stockActual, stockMinimo) {
  if (stockActual <= 0) return 'AGOTADO'
  if (stockActual <= stockMinimo) return 'REORDEN_NECESARIA'
  return 'STOCK_OPTIMO'
}

export { appointmentStates, invoiceStates, stockStates, quoteStates }
