export const dashboardStats = [
  { key: 'citas', title: 'Citas hoy', value: '8', hint: '3 confirmadas', tone: 'default' },
  {
    key: 'ordenes',
    title: 'Órdenes abiertas',
    value: '14',
    hint: '5 en diagnóstico',
    tone: 'warning',
  },
  {
    key: 'facturar',
    title: 'Listos para facturar',
    value: '4',
    hint: 'Trabajo finalizado',
    tone: 'success',
  },
  {
    key: 'pago',
    title: 'Pendientes de pago',
    value: '3',
    hint: 'Entrega bloqueada',
    tone: 'danger',
  },
  { key: 'stock', title: 'Stock bajo', value: '6', hint: '2 refrigerantes', tone: 'warning' },
  {
    key: 'ingresos',
    title: 'Ingresos del día',
    value: 'RD$ 48,500',
    hint: '4 facturas pagadas',
    tone: 'success',
  },
]

export const recentOrdenes = [
  {
    id: 1,
    numero: 'OT-SDQ-1042',
    vehiculo: 'Toyota Corolla · A123456',
    cliente: 'María López',
    estado: 'EN_DIAGNOSTICO',
  },
  {
    id: 2,
    numero: 'OT-SDQ-1041',
    vehiculo: 'Hyundai Tucson · B987654',
    cliente: 'Grupo Nova SRL',
    estado: 'EN_REPARACION',
  },
  {
    id: 3,
    numero: 'OT-SDQ-1040',
    vehiculo: 'Kia Sportage · C456789',
    cliente: 'Carlos Pérez',
    estado: 'FACTURADA',
  },
  {
    id: 4,
    numero: 'OT-SDQ-1039',
    vehiculo: 'Nissan X-Trail · D321654',
    cliente: 'Ana Martínez',
    estado: 'CERRADA',
  },
]

export const upcomingCitas = [
  {
    id: 1,
    hora: '09:00',
    cliente: 'Luis Ramírez',
    vehiculo: 'Honda CR-V',
    motivo: 'Aire no enfría',
  },
  {
    id: 2,
    hora: '10:30',
    cliente: 'Transporte del Caribe',
    vehiculo: 'Ford Transit',
    motivo: 'Recarga R-134a',
  },
  {
    id: 3,
    hora: '14:00',
    cliente: 'Sofía Encarnación',
    vehiculo: 'Mazda 3',
    motivo: 'Olor a humedad',
  },
]

// Mismos campos que la tabla `materiales`: el stock es numérico y la unidad va aparte.
export const stockAlerts = [
  { id: 1, nombre: 'R-134a', stockActual: 2.5, stockMinimo: 5, unidadMedida: 'kg' },
  {
    id: 2,
    nombre: 'Filtro secador universal',
    stockActual: 3,
    stockMinimo: 8,
    unidadMedida: 'uds',
  },
  { id: 3, nombre: 'Aceite PAG 46', stockActual: 1.2, stockMinimo: 4, unidadMedida: 'L' },
]
