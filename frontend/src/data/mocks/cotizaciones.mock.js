// Cotizaciones es una extensión propuesta: el SRS la menciona como función, pero no le
// dedica un requisito ni una tabla, así que todavía no hay dónde guardarla.
//
// Estos mocks siguen la forma del esquema solicitado al equipo de base de datos: un
// maestro con los totales y un detalle por línea, igual que el par facturas /
// factura_detalles que ya existe.
export const cotizaciones = [
  {
    id: 1,
    numero: 'COT-SDQ-220',
    cliente: 'María López',
    vehiculo: 'Toyota Corolla · A123456',
    estado: 'ENVIADA',
    vigencia: '2026-07-20',
    subtotal: 10593.22,
    impuesto: 1906.78,
    total: 12500,
    detalles: [
      {
        id: 1,
        tipoItem: 'SERVICIO',
        descripcion: 'Diagnóstico HVAC',
        cantidad: 1,
        precioUnitario: 2500,
      },
      {
        id: 2,
        tipoItem: 'REFRIGERANTE',
        descripcion: 'Recarga R-134a',
        cantidad: 1,
        precioUnitario: 4500,
      },
      {
        id: 3,
        tipoItem: 'SERVICIO',
        descripcion: 'Reparación de fuga menor',
        cantidad: 1,
        precioUnitario: 4000,
      },
    ],
  },
  {
    id: 2,
    numero: 'COT-SDQ-219',
    cliente: 'Grupo Nova SRL',
    vehiculo: 'Hyundai Tucson · B987654',
    estado: 'APROBADA',
    vigencia: '2026-07-18',
    subtotal: 24067.8,
    impuesto: 4332.2,
    total: 28400,
    detalles: [
      {
        id: 4,
        tipoItem: 'MATERIAL',
        descripcion: 'Compresor HVAC',
        cantidad: 1,
        precioUnitario: 18500,
      },
      {
        id: 5,
        tipoItem: 'SERVICIO',
        descripcion: 'Instalación de compresor',
        cantidad: 1,
        precioUnitario: 5567.8,
      },
    ],
  },
  {
    id: 3,
    numero: 'COT-SDQ-218',
    cliente: 'Carlos Pérez',
    vehiculo: 'Kia Sportage · C456789',
    estado: 'BORRADOR',
    vigencia: '2026-07-25',
    subtotal: 7542.37,
    impuesto: 1357.63,
    total: 8900,
    detalles: [
      {
        id: 6,
        tipoItem: 'SERVICIO',
        descripcion: 'Mantenimiento preventivo HVAC',
        cantidad: 1,
        precioUnitario: 3900,
      },
      {
        id: 7,
        tipoItem: 'MATERIAL',
        descripcion: 'Filtro secador universal',
        cantidad: 1,
        precioUnitario: 1450,
      },
      {
        id: 8,
        tipoItem: 'CONSUMIBLE',
        descripcion: 'Aceite PAG 46',
        cantidad: 2,
        precioUnitario: 1100,
      },
    ],
  },
]
