// La sesión vive únicamente durante la pestaña actual. El servidor sigue siendo
// la autoridad: el frontend nunca decide si un token o un permiso es válido.
const ROLE_KEY = 'sgtra-demo-role'
const BRANCH_KEY = 'sgtra-sucursal-activa'
const SESSION_KEY = 'sgtra-session'

function readSession() {
  try {
    const stored = window.sessionStorage.getItem(SESSION_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function getRole() {
  return readSession()?.user?.roles?.[0] || window.sessionStorage.getItem(ROLE_KEY)
}

export function startSession(sessionOrRole) {
  if (typeof sessionOrRole === 'string') {
    window.sessionStorage.setItem(ROLE_KEY, sessionOrRole)
    return
  }

  const token = sessionOrRole?.token || sessionOrRole?.accessToken
  const user = sessionOrRole?.user || sessionOrRole?.usuario
  if (!token || !user) throw new Error('La respuesta de inicio de sesión está incompleta.')

  const roles = Array.isArray(user.roles)
    ? user.roles.map((role) => (typeof role === 'string' ? role : role.codigo || role.nombre))
    : [user.rol].filter(Boolean)
  const normalized = {
    token,
    user: {
      ...user,
      id: Number(user.id ?? user.idUsuario ?? user.id_usuario),
      idSucursal: Number(user.idSucursal ?? user.sucursalId ?? user.id_sucursal) || null,
      roles,
    },
  }
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(normalized))
  window.sessionStorage.removeItem(ROLE_KEY)
  if (normalized.user.idSucursal) setBranchId(normalized.user.idSucursal)
}

export function endSession() {
  window.sessionStorage.removeItem(ROLE_KEY)
  window.sessionStorage.removeItem(BRANCH_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
}

export function getAccessToken() {
  return readSession()?.token || null
}

export function getCurrentUser() {
  return readSession()?.user || null
}

export function isApiSession() {
  return Boolean(getAccessToken())
}

export function isSignedIn() {
  return Boolean(getAccessToken() || window.sessionStorage.getItem(ROLE_KEY))
}

export function getBranchId() {
  const stored = window.sessionStorage.getItem(BRANCH_KEY)
  return stored ? Number(stored) : null
}

export function setBranchId(id) {
  window.sessionStorage.setItem(BRANCH_KEY, String(id))
}
