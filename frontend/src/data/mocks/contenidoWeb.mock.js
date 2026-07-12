// Texto del sitio público. No es un dato del taller y nunca saldrá de PostgreSQL,
// así que las páginas lo importan directamente en vez de pedirlo a un servicio.
// Todo lo que sí vendrá de la base de datos (servicios, sucursales, órdenes...) pasa
// por services/.
export const sintomasFrecuentes = [
  { label: 'Huele mal', note: 'Filtro, humedad o evaporador' },
  { label: 'Hace ruido', note: 'Compresor, ventilador o correa' },
  { label: 'Enfría poco', note: 'Carga, presión o condensador' },
  { label: 'No enfría nada', note: 'Fuga, compresor o control' },
]

export const pasosDelProceso = [
  {
    step: '01',
    title: 'Recepción',
    description: 'Escuchamos el síntoma y registramos el vehículo.',
  },
  { step: '02', title: 'Diagnóstico', description: 'Medimos el sistema antes de intervenir.' },
  {
    step: '03',
    title: 'Autorización',
    description: 'Explicamos el hallazgo y el trabajo propuesto.',
  },
  {
    step: '04',
    title: 'Entrega',
    description: 'Verificamos rendimiento y documentamos el servicio.',
  },
]
