// Guarda la sesión de demostración (rol y sucursal activa) en sessionStorage.
//
// No es autenticación: no hay contraseña comprobada ni token firmado, y cualquiera
// puede editar sessionStorage desde el navegador. Sirve para que la demo recuerde
// con qué rol y en qué sucursal se está trabajando mientras se navega.
//
// Cuando el backend exista, el login devolverá un token y los datos del usuario, y
// solo cambiará lo que se guarda aquí: las pantallas seguirán llamando a las mismas
// funciones.
const ROLE_KEY = 'sgtra-demo-role'
const BRANCH_KEY = 'sgtra-sucursal-activa'

export function getRole() {
  return window.sessionStorage.getItem(ROLE_KEY)
}

export function startSession(role) {
  window.sessionStorage.setItem(ROLE_KEY, role)
}

export function endSession() {
  window.sessionStorage.removeItem(ROLE_KEY)
  window.sessionStorage.removeItem(BRANCH_KEY)
}

export function isSignedIn() {
  return Boolean(getRole())
}

export function getBranchId() {
  const stored = window.sessionStorage.getItem(BRANCH_KEY)
  return stored ? Number(stored) : null
}

export function setBranchId(id) {
  window.sessionStorage.setItem(BRANCH_KEY, String(id))
}
