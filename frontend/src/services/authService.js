import { apiEndpoints } from '@/constants/apiEndpoints'
import { demoRoles } from '@/constants/demoRoles'
import { apiRequest } from './api'
import { dataSource } from './dataSource'
import { startSession } from './sessionStore'

export async function iniciarSesion({ email, password, role }) {
  if (dataSource === 'mock') {
    startSession(role)
    return { user: { nombre: demoRoles[role].name, roles: [role] }, demo: true }
  }

  const session = await apiRequest(apiEndpoints.sessions, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  startSession(session)
  return session
}
