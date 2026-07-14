// Interruptor central de datos. Si VITE_DATA_SOURCE=api, los services llaman al
// backend; en cualquier otro caso usan datos mock para que el frontend funcione solo.
export const dataSource = import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock'
export const usingMocks = dataSource === 'mock'
