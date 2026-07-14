import { describe, expect, it } from 'vitest'
import { resolveDataSource } from './dataSource'

describe('origen de datos', () => {
  it('usa la API cuando no existe una configuración explícita', () => {
    expect(resolveDataSource('development')).toBe('api')
  })

  it('solo activa mocks cuando se solicitan de forma explícita', () => {
    expect(resolveDataSource('development', 'mock')).toBe('mock')
  })

  it('aísla las pruebas unitarias de servicios externos', () => {
    expect(resolveDataSource('test', 'api')).toBe('mock')
  })
})
