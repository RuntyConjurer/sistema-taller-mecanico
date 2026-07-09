export function formatCurrency(value, currency = 'DOP') {
  return new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency,
  }).format(value)
}
