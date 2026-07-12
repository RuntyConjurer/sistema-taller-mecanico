import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { demoRoles } from '@/constants/demoRoles'
import { startSession } from '@/services/sessionStore'
import { Select } from '@/components/ui/select'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('RECEPCIONISTA')

  // Si el guard interceptó una ruta, se vuelve a ella tras entrar.
  const destino = location.state?.from || '/app'

  function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    // El retardo imita la espera de una petición real. Cuando exista el backend,
    // aquí se llamará a POST /api/v1/sesiones y se guardará el token que devuelva.
    window.setTimeout(() => {
      startSession(role)
      navigate(destino, { replace: true })
    }, 500)
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="usuario">Usuario o correo</Label>
        <Input
          id="usuario"
          name="usuario"
          autoComplete="username"
          placeholder="recepcion@climaauto.rd"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rol-demo">Rol de demostración</Label>
        <Select id="rol-demo" value={role} onChange={(event) => setRole(event.target.value)}>
          {Object.entries(demoRoles).map(([code, item]) => (
            <option key={code} value={code}>
              {item.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Ingresando...' : 'Ingresar al panel'}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Ingresarás como {demoRoles[role].label}. Prototipo académico sin autenticación ni permisos
        reales.
      </p>
    </form>
  )
}

export default Login
