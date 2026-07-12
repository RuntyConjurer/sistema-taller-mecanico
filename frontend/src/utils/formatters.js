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
