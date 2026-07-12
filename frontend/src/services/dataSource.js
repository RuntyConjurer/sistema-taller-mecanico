export const dataSource = import.meta.env.VITE_DATA_SOURCE === 'api' ? 'api' : 'mock'
export const usingMocks = dataSource === 'mock'
