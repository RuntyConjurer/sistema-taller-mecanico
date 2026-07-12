import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import RequireSession from './RequireSession'
import { endSession, startSession } from '@/services/sessionStore'

// Monta las rutas en memoria empezando en /app y devuelve lo que acaba renderizando.
function renderizarEn(ruta) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)

  act(() => {
    root.render(
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path="/login" element={<p>Pantalla de login</p>} />
          <Route
            path="/app"
            element={
              <RequireSession>
                <p>Panel del taller</p>
              </RequireSession>
            }
          />
        </Routes>
      </MemoryRouter>,
    )
  })

  return { texto: container.textContent, root, container }
}

describe('RequireSession', () => {
  beforeEach(() => {
    endSession()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('manda al login si se entra a /app sin haber iniciado sesión', () => {
    const { texto } = renderizarEn('/app')
    expect(texto).toContain('Pantalla de login')
    expect(texto).not.toContain('Panel del taller')
  })

  it('deja pasar al panel cuando hay sesión', () => {
    startSession('TECNICO')
    const { texto } = renderizarEn('/app')
    expect(texto).toContain('Panel del taller')
  })
})
