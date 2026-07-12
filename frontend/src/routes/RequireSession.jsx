import { Navigate, useLocation } from 'react-router-dom'
import { isSignedIn } from '@/services/sessionStore'

// Impide entrar al panel escribiendo la URL sin haber pasado por el login.
//
// Es una protección de navegación, no de seguridad: el frontend se ejecuta en el
// navegador del usuario y cualquiera puede saltárselo. La comprobación que cuenta
// es la del backend, que debe rechazar toda petición sin sesión válida.
function RequireSession({ children }) {
  const location = useLocation()

  if (!isSignedIn()) {
    // `state` recuerda a dónde iba, para volver ahí después de iniciar sesión.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default RequireSession
