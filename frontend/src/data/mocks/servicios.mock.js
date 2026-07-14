// Refleja la tabla `servicios` (id_servicio, nombre, descripcion, precio_base,
// porcentaje_impuesto, activo).
//
// Los campos `slug`, `duracion`, `sintomas`, `proceso` y `faq` no son columnas: son
// contenido del sitio público. El backend puede devolverlos o no; si no lo hace, el
// catálogo interno sigue funcionando y solo el sitio público muestra menos detalle.
//
// `precioBase` es un número, no el texto "Desde RD$ 2,500": la tabla lo guarda como
// NUMERIC y la interfaz lo formatea con formatCurrency().
export const servicios = [
  {
    id: 1,
    slug: 'diagnostico',
    nombre: 'Diagnóstico HVAC',
    descripcion: 'Lecturas de presión, temperatura y prueba de fuga.',
    precioBase: 2500,
    porcentajeImpuesto: 18,
    activo: true,
    duracion: '45-60 min',
    sintomas: ['Aire tibio', 'Compresor intermitente', 'Olor al encender'],
    proceso: ['Inspección visual', 'Medición del circuito', 'Informe técnico'],
    faq: 'El diagnóstico determina la causa antes de recomendar una reparación.',
  },
  {
    id: 2,
    slug: 'recarga',
    nombre: 'Carga de gas refrigerante',
    descripcion: 'Vacío del sistema, carga precisa y comprobación final.',
    precioBase: 4500,
    porcentajeImpuesto: 18,
    activo: true,
    duracion: '60-90 min',
    sintomas: ['Enfría poco', 'No enfría en tráfico', 'Baja presión'],
    proceso: ['Recuperación', 'Vacío del sistema', 'Carga por especificación'],
    faq: 'La cantidad se ajusta al tipo de refrigerante y a la especificación del vehículo.',
  },
  {
    id: 3,
    slug: 'fugas',
    nombre: 'Detección de fugas',
    descripcion: 'Localización técnica de pérdidas en el circuito.',
    precioBase: 3200,
    porcentajeImpuesto: 18,
    activo: true,
    duracion: '50-75 min',
    sintomas: ['Pierde frío rápido', 'Recargas frecuentes', 'Manchas de aceite'],
    proceso: ['Prueba de presión', 'Detección localizada', 'Propuesta de reparación'],
    faq: 'Una recarga no sustituye la reparación de una fuga activa.',
  },
  {
    id: 4,
    slug: 'evaporador',
    nombre: 'Limpieza de evaporador',
    descripcion: 'Saneamiento de la cabina y recuperación del flujo de aire.',
    precioBase: 6800,
    porcentajeImpuesto: 18,
    activo: true,
    duracion: '90-120 min',
    sintomas: ['Huele mal', 'Flujo débil', 'Humedad en la cabina'],
    proceso: ['Evaluación de cabina', 'Limpieza técnica', 'Verificación de flujo'],
    faq: 'Se recomienda cuando hay olor persistente o poco caudal de aire.',
  },
]
