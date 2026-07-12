export const services = [
  { id: 'diagnostico', title: 'Diagnóstico HVAC', short: 'Lecturas de presión, temperatura y fuga.', price: 'Desde RD$ 2,500', duration: '45-60 min', symptoms: ['Aire tibio', 'Compresor intermitente', 'Olor al encender'], process: ['Inspección visual', 'Medición del circuito', 'Informe técnico'], faq: 'El diagnóstico determina la causa antes de recomendar una reparación.' },
  { id: 'recarga', title: 'Carga de gas refrigerante', short: 'Vacío, carga precisa y comprobación final.', price: 'Desde RD$ 4,500', duration: '60-90 min', symptoms: ['Enfría poco', 'No enfría en tráfico', 'Baja presión'], process: ['Recuperación', 'Vacío del sistema', 'Carga por especificación'], faq: 'La cantidad se ajusta al tipo de refrigerante y especificación del vehículo.' },
  { id: 'fugas', title: 'Detección de fugas', short: 'Localización técnica de pérdidas del circuito.', price: 'Desde RD$ 3,200', duration: '50-75 min', symptoms: ['Pierde frío rápido', 'Recargas frecuentes', 'Manchas de aceite'], process: ['Prueba de presión', 'Detección localizada', 'Propuesta de reparación'], faq: 'Una recarga no sustituye la reparación de una fuga activa.' },
  { id: 'evaporador', title: 'Limpieza de evaporador', short: 'Saneamiento y recuperación de flujo de aire.', price: 'Desde RD$ 6,800', duration: '90-120 min', symptoms: ['Huele mal', 'Flujo débil', 'Alergias u humedad'], process: ['Evaluación de cabina', 'Limpieza técnica', 'Verificación de flujo'], faq: 'El servicio se recomienda cuando hay olor persistente o bajo caudal.' },
]

export const symptoms = [
  { label: 'Huele mal', note: 'Filtro, humedad o evaporador' },
  { label: 'Hace ruido', note: 'Compresor, ventilador o correa' },
  { label: 'Enfría poco', note: 'Carga, presión o condensador' },
  { label: 'No enfría nada', note: 'Fuga, compresor o control' },
]

export const processSteps = [
  { step: '01', title: 'Recepción', description: 'Escuchamos el síntoma y registramos el vehículo.' },
  { step: '02', title: 'Diagnóstico', description: 'Medimos el sistema antes de intervenir.' },
  { step: '03', title: 'Autorización', description: 'Explicamos el hallazgo y el trabajo propuesto.' },
  { step: '04', title: 'Entrega', description: 'Verificamos rendimiento y documentamos el servicio.' },
]

export const branches = [
  { id: 'norte', name: 'Sucursal Norte', city: 'Santo Domingo', address: 'Av. Industrial 4500, Naco', schedule: 'Lun-Vie 8:00-18:00 · Sáb 8:00-14:00', phone: '+1 (809) 555-0142', technicians: ['Juan Pérez · Diagnóstico y recarga', 'María González · Compresores', 'Carlos Ruiz · Fugas y sistema eléctrico'] },
  { id: 'santiago', name: 'Sucursal Santiago', city: 'Santiago', address: 'Av. 27 de Febrero 210, La Trinitaria', schedule: 'Lun-Vie 8:00-18:00 · Sáb 8:00-13:00', phone: '+1 (809) 555-0142', technicians: ['Ana Rodríguez · Diagnóstico', 'Pedro Santos · Refrigerantes'] },
]
