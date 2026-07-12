export function formatCurrency(value, currency = 'DOP') {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
  }).format(value)
}

export function formatDate(value) {
  return new Intl.DateTimeFormat('es-DO', {
    dateStyle: 'medium',
    timeZone: 'America/Santo_Domingo',
  }).format(new Date(value))
}

// La base de datos guarda la cantidad y la unidad por separado (stock_actual y
// unidad_medida). Unirlas es trabajo de presentación, no de almacenamiento.
export function formatQuantity(value, unit) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—'
  const amount = new Intl.NumberFormat('es-DO', { maximumFractionDigits: 2 }).format(Number(value))
  return unit ? `${amount} ${unit}` : amount
}
