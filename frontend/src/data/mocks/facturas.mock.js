// Refleja `facturas` más el vínculo de `factura_ordenes_trabajo`.
//
// `ordenId` es el campo con el que el frontend cruza la factura con su orden de
// trabajo: la pantalla de OT lo necesita para saber si la factura está pagada y
// habilitar el cierre. En la base de datos ese vínculo lo guarda la tabla puente
// factura_ordenes_trabajo, con UNIQUE(id_ot): una OT se factura una sola vez.
//
// `balance` es lo que queda por cobrar; no es una columna de la tabla, el backend lo
// calculará restando los pagos aplicados (pago_facturas) al total.
export const facturas = [
  {
    id: 1,
    numero: 'FAC-SDQ-501',
    cliente: 'Carlos Pérez',
    total: 8900,
    balance: 0,
    estado: 'PAGADA',
    ordenId: 3,
  },
  {
    id: 2,
    numero: 'FAC-SDQ-500',
    cliente: 'Grupo Nova SRL',
    total: 28400,
    balance: 14200,
    estado: 'PENDIENTE',
    ordenId: 2,
  },
  {
    id: 3,
    numero: 'FAC-SDQ-499',
    cliente: 'María López',
    total: 12500,
    balance: 12500,
    estado: 'PENDIENTE',
    ordenId: 1,
  },
]
