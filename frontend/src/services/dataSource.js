// La aplicación usa la API salvo que se solicite explícitamente el modo mock.
// Las pruebas unitarias mantienen mocks para no depender de servicios externos.
export function resolveDataSource(mode, configuredSource) {
  if (mode === 'test') return 'mock'
  return configuredSource === 'mock' ? 'mock' : 'api'
}

export const dataSource = resolveDataSource(import.meta.env.MODE, import.meta.env.VITE_DATA_SOURCE)
export const usingMocks = dataSource === 'mock'
