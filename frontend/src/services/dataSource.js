// Interruptor central de datos. Si VITE_DATA_SOURCE=api, los services llaman al
// backend; en cualquier otro caso usan datos mock para que el frontend funcione solo.
// Las pruebas unitarias siempre usan mocks y no dependen de un servidor externo.
const requestedSource = import.meta.env.MODE === 'test' ? 'mock' : import.meta.env.VITE_DATA_SOURCE
export const dataSource = requestedSource === 'api' ? 'api' : 'mock'
export const usingMocks = dataSource === 'mock'
