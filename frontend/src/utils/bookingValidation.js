export const bookingSteps = [
  ['marca', 'modelo', 'anio', 'placa', 'chasis'],
  ['servicio'],
  ['sucursal', 'fecha', 'hora'],
  ['tipoCliente', 'tipoIdentificacion', 'nombre', 'documento', 'telefono'],
]

// Forma completa del formulario. Tener todas las llaves desde el inicio evita
// inputs "sin controlar" en React y facilita guardar/restaurar el borrador.
export const bookingInitialForm = {
  tipoCliente: 'PERSONA',
  tipoIdentificacion: 'CEDULA',
  marca: '',
  modelo: '',
  anio: '',
  placa: '',
  chasis: '',
  servicio: '',
  detalle: '',
  sucursal: '',
  fecha: '',
  hora: '',
  nombre: '',
  documento: '',
  telefono: '',
  email: '',
}

/** Reglas de interfaz alineadas con los datos requeridos por cliente, vehículo y cita. */
export function validateBookingField(name, value) {
  const text = String(value ?? '').trim()
  if (bookingSteps.flat().includes(name) && !text) return 'Completa este campo para continuar.'
  if (name === 'anio' && text && !/^(19|20)\d{2}$/.test(text))
    return 'Indica un año válido de cuatro dígitos.'
  if (name === 'telefono' && text && text.replace(/\D/g, '').length < 10)
    return 'Usa un teléfono con al menos 10 dígitos.'
  if (name === 'email' && text && !/^\S+@\S+\.\S+$/.test(text))
    return 'Escribe un correo con formato válido.'
  if (name === 'chasis' && text && text.length < 6)
    return 'El chasis debe tener al menos 6 caracteres.'
  if (name === 'fecha' && text) {
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santo_Domingo' }).format(
      new Date(),
    )
    if (text < today) return 'Selecciona una fecha futura.'
  }
  return ''
}

export function loadBookingDraft() {
  try {
    // El borrador vive en sessionStorage: se conserva al navegar dentro de la
    // pestana, pero se limpia al cerrar la sesion del navegador.
    const saved = window.sessionStorage.getItem('sgtra-booking-draft')
    return saved ? { ...bookingInitialForm, ...JSON.parse(saved) } : bookingInitialForm
  } catch {
    window.sessionStorage.removeItem('sgtra-booking-draft')
    return bookingInitialForm
  }
}
