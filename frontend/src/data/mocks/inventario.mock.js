export const productos = [
  {
    id: 1,
    codigo: 'REF-134A',
    nombre: 'R-134a 13.6kg',
    categoria: 'Refrigerante',
    existencia: '2.5 kg',
    minimo: '5 kg',
    esRefrigerante: true,
  },
  {
    id: 2,
    codigo: 'FIL-SEC-01',
    nombre: 'Filtro secador universal',
    categoria: 'Repuesto',
    existencia: '12 uds',
    minimo: '8 uds',
    esRefrigerante: false,
  },
  {
    id: 3,
    codigo: 'ACE-PAG46',
    nombre: 'Aceite PAG 46',
    categoria: 'Consumible',
    existencia: '6.5 L',
    minimo: '4 L',
    esRefrigerante: false,
  },
  {
    id: 4,
    codigo: 'REF-1234YF',
    nombre: 'R-1234yf 5kg',
    categoria: 'Refrigerante',
    existencia: '8.0 kg',
    minimo: '3 kg',
    esRefrigerante: true,
  },
]

export const refrigerantes = [
  { id: 1, tipo: 'R-134a', existencia: '2.5 kg', consumoMes: '18.5 kg', ordenes: 14 },
  { id: 2, tipo: 'R-1234yf', existencia: '8.0 kg', consumoMes: '6.2 kg', ordenes: 5 },
]

export const movimientos = [
  {
    id: 1,
    fecha: '2026-07-11',
    producto: 'R-134a',
    tipo: 'Salida',
    cantidad: '0.85 kg',
    motivo: 'OT-SDQ-1041',
  },
  {
    id: 2,
    fecha: '2026-07-10',
    producto: 'Filtro secador',
    tipo: 'Salida',
    cantidad: '1 uds',
    motivo: 'OT-SDQ-1040',
  },
  {
    id: 3,
    fecha: '2026-07-09',
    producto: 'R-1234yf',
    tipo: 'Entrada',
    cantidad: '5 kg',
    motivo: 'Compra proveedor',
  },
]
