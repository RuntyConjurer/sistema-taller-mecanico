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

export function getStateMeta(group, value) {
  const states = group === 'cita' ? appointmentStates : invoiceStates
  return states[value] || { label: value || 'Sin estado', tone: 'muted' }
}

export { appointmentStates, invoiceStates }
