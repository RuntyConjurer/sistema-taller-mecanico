import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import AppRoutes from './AppRoutes'
import { endSession, startSession } from '@/services/sessionStore'

// Prueba de humo: monta la aplicación de verdad en cada ruta y comprueba que no
// revienta al renderizar. El build y el linter no detectan estos fallos.
async function montar(ruta) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  await act(async () => {
    root.render(
      <MemoryRouter initialEntries={[ruta]}>
        <AppRoutes />
      </MemoryRouter>,
    )
  })

  return container
}

const rutasPublicas = ['/', '/servicios', '/servicios/diagnostico', '/agendar-cita', '/proceso']

const rutasPanel = [
  '/app',
  '/app/citas',
  '/app/cotizaciones',
  '/app/ordenes-trabajo',
  '/app/diagnosticos',
  '/app/clientes',
  '/app/vehiculos',
  '/app/inventario',
  '/app/refrigerantes',
  '/app/facturacion',
  '/app/usuarios',
  '/app/reportes',
]

describe('AppRoutes', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('sitio público', () => {
    it.each(rutasPublicas)('renderiza %s sin errores', async (ruta) => {
      const container = await montar(ruta)
      expect(container.textContent.length).toBeGreaterThan(0)
    })
  })

  describe('panel del taller', () => {
    beforeEach(() => {
      // El panel exige sesión: sin ella, el guard redirige al login.
      startSession('ADMINISTRADOR')
    })

    afterEach(() => {
      endSession()
    })

    it.each(rutasPanel)('renderiza %s sin errores', async (ruta) => {
      const container = await montar(ruta)
      expect(container.textContent.length).toBeGreaterThan(0)
      expect(container.textContent).not.toContain('Pantalla de login')
    })
  })
})
