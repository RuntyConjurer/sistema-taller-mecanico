export const ordenes = [
  {
    id: 1,
    numero: 'OT-SDQ-1042',
    cliente: 'María López',
    vehiculo: 'Toyota Corolla · A123456',
    tecnico: 'Juan Méndez',
    estado: 'EN_DIAGNOSTICO',
    prioridad: 'Normal',
    recepcion: '2026-07-11 08:30',
    sintomas: 'Aire sale tibio, compresor intermitente',
  },
  {
    id: 2,
    numero: 'OT-SDQ-1041',
    cliente: 'Grupo Nova SRL',
    vehiculo: 'Hyundai Tucson · B987654',
    tecnico: 'Pedro Santos',
    estado: 'EN_REPARACION',
    prioridad: 'Alta',
    recepcion: '2026-07-10 10:15',
    sintomas: 'Fuga detectada en línea de baja',
  },
  {
    id: 3,
    numero: 'OT-SDQ-1040',
    cliente: 'Carlos Pérez',
    vehiculo: 'Kia Sportage · C456789',
    tecnico: 'Ana Rodríguez',
    estado: 'FACTURADA',
    prioridad: 'Normal',
    recepcion: '2026-07-09 09:00',
    sintomas: 'Recarga y limpieza de evaporador',
  },
]

export const ordenTimeline = [
  { estado: 'ABIERTA', fecha: '2026-07-11 08:30', usuario: 'Recepción' },
  { estado: 'EN_DIAGNOSTICO', fecha: '2026-07-11 09:15', usuario: 'Juan Méndez' },
]

export const diagnosticoMock = {
  presionBaja: 32,
  presionAlta: 185,
  temperaturaAmbiente: 32,
  temperaturaSalida: 8.5,
  refrigerante: 'R-134a',
  compresor: 'Operativo con ruido leve',
  fugas: 'Positiva en unión de línea de baja',
  falla: 'Fuga menor + baja carga',
  recomendacion: 'Reparar unión, vacío y recarga',
}
