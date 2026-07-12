// Refleja la tabla `materiales` de PostgreSQL: un único catálogo con la columna
// `categoria` (REPUESTO | REFRIGERANTE | CONSUMIBLE), el stock como número y la
// unidad de medida en su propio campo. Mantener aquí los mismos tipos que la base
// de datos evita que las pantallas se rompan al cambiar VITE_DATA_SOURCE=api.
export const materiales = [
  {
    id: 1,
    codigo: 'REF-134A',
    nombre: 'R-134a',
    categoria: 'REFRIGERANTE',
    unidadMedida: 'kg',
    stockActual: 2.5,
    stockMinimo: 5,
    costoUnitario: 950,
    precioVenta: 1600,
  },
  {
    id: 2,
    codigo: 'FIL-SEC-01',
    nombre: 'Filtro secador universal',
    categoria: 'REPUESTO',
    unidadMedida: 'uds',
    stockActual: 12,
    stockMinimo: 8,
    costoUnitario: 780,
    precioVenta: 1450,
  },
  {
    id: 3,
    codigo: 'ACE-PAG46',
    nombre: 'Aceite PAG 46',
    categoria: 'CONSUMIBLE',
    unidadMedida: 'L',
    stockActual: 6.5,
    stockMinimo: 4,
    costoUnitario: 640,
    precioVenta: 1100,
  },
  {
    id: 4,
    codigo: 'REF-1234YF',
    nombre: 'R-1234yf',
    categoria: 'REFRIGERANTE',
    unidadMedida: 'kg',
    stockActual: 8,
    stockMinimo: 3,
    costoUnitario: 2400,
    precioVenta: 3900,
  },
]

// El backend calculará esto agregando `inventario_movimientos`; aquí se guarda
// precalculado para poder mostrar la pantalla de refrigerantes sin API.
export const consumoRefrigerantes = {
  1: { consumoMes: 18.5, ordenes: 14 },
  4: { consumoMes: 6.2, ordenes: 5 },
}

// Refleja `inventario_movimientos`: el trigger de la base de datos inserta una
// SALIDA automáticamente cada vez que se consume material en una orden.
export const movimientos = [
  {
    id: 1,
    fecha: '2026-07-11',
    material: 'R-134a',
    tipo: 'SALIDA',
    cantidad: 0.85,
    unidadMedida: 'kg',
    motivo: 'OT-SDQ-1041',
  },
  {
    id: 2,
    fecha: '2026-07-10',
    material: 'Filtro secador universal',
    tipo: 'SALIDA',
    cantidad: 1,
    unidadMedida: 'uds',
    motivo: 'OT-SDQ-1040',
  },
  {
    id: 3,
    fecha: '2026-07-09',
    material: 'R-1234yf',
    tipo: 'ENTRADA',
    cantidad: 5,
    unidadMedida: 'kg',
    motivo: 'Compra proveedor',
  },
]
