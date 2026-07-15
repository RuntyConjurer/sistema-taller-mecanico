export const MIN_VEHICLE_YEAR = 1980
export const MAX_VEHICLE_YEAR = 2027

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
  whatsappOptIn: false,
}

const DOMINICAN_AREA_CODES = new Set(['809', '829', '849'])

function onlyDigits(value) {
  return String(value ?? '').replace(/\D/g, '')
}

export function normalizeDominicanPhone(value) {
  const digits = onlyDigits(value)
  return digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
}

function isRepeatedDigits(value) {
  return /^(\d)\1+$/.test(value)
}

export function sanitizeBookingField(name, value, form = {}) {
  const text = String(value ?? '')

  if (name === 'anio') return onlyDigits(text).slice(0, 4)
  if (name === 'telefono') return onlyDigits(text).slice(0, 11)
  if (name === 'email') return text.replace(/\s/g, '').toLowerCase().slice(0, 100)
  if (name === 'chasis')
    return text
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 17)
  if (name === 'placa')
    return text
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, '')
      .slice(0, 10)
  if (name === 'documento') {
    const documentType = form.tipoIdentificacion
    if (documentType === 'CEDULA') return onlyDigits(text).slice(0, 11)
    if (documentType === 'RNC') return onlyDigits(text).slice(0, 9)
    return text
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 20)
  }
  if (name === 'nombre') return text.replace(/\s+/g, ' ').slice(0, 150)
  if (name === 'marca' || name === 'modelo') return text.replace(/\s+/g, ' ').slice(0, 80)
  if (name === 'detalle') return text.slice(0, 250)

  return value
}

/** Reglas de interfaz alineadas con los datos requeridos por cliente, vehículo y cita. */
export function validateBookingField(name, value, form = {}) {
  const text = String(value ?? '').trim()
  if (bookingSteps.flat().includes(name) && !text) return 'Completa este campo para continuar.'

  if (name === 'anio' && text) {
    const year = Number(text)
    if (!/^\d{4}$/.test(text) || year < MIN_VEHICLE_YEAR || year > MAX_VEHICLE_YEAR) {
      return `El año debe estar entre ${MIN_VEHICLE_YEAR} y ${MAX_VEHICLE_YEAR}.`
    }
  }

  if (name === 'telefono' && text) {
    const phone = normalizeDominicanPhone(text)
    if (
      phone.length !== 10 ||
      !DOMINICAN_AREA_CODES.has(phone.slice(0, 3)) ||
      !/^[2-9]/.test(phone.slice(3)) ||
      isRepeatedDigits(phone)
    ) {
      return 'Usa un teléfono dominicano real: 809, 829 o 849 + 7 dígitos.'
    }
  }

  if (name === 'email' && text) {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    if (!emailPattern.test(text) || text.includes('..'))
      return 'Escribe un correo con formato válido.'
  }

  if (name === 'documento' && text) {
    const documentType = form.tipoIdentificacion
    if (documentType === 'CEDULA' && !/^\d{11}$/.test(text))
      return 'La cédula debe tener 11 dígitos.'
    if (documentType === 'RNC' && !/^\d{9}$/.test(text)) return 'El RNC debe tener 9 dígitos.'
    if (documentType === 'PASAPORTE' && !/^[A-Z0-9]{6,20}$/i.test(text)) {
      return 'El pasaporte debe tener de 6 a 20 letras o números.'
    }
  }

  if (name === 'placa' && text && !/^[A-Z0-9][A-Z0-9-]{3,9}$/.test(text)) {
    return 'La placa debe tener de 4 a 10 letras, números o guiones.'
  }

  if (name === 'chasis' && text && !/^[A-Z0-9]{6,17}$/i.test(text)) {
    return 'El chasis debe tener de 6 a 17 letras o números, sin espacios.'
  }

  if (name === 'nombre' && text && !/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]{2,}/.test(text)) {
    return 'Escribe un nombre válido.'
  }

  if (
    (name === 'marca' || name === 'modelo') &&
    text &&
    !/[A-Za-z0-9ÁÉÍÓÚÜÑáéíóúüñ]{2,}/.test(text)
  ) {
    return 'Escribe un valor válido.'
  }

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
