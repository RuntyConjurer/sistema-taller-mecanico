import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { demoRoles } from '@/constants/demoRoles'
import { iniciarSesion } from '@/services/authService'
import { usingMocks } from '@/services/dataSource'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('RECEPCIONISTA')
  const [error, setError] = useState('')
  const destino = location.state?.from || '/app'

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const form = new FormData(event.currentTarget)
    try {
      await iniciarSesion({
        email: form.get('email'),
        password: form.get('password'),
        role,
      })
      navigate(destino, { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'No fue posible iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {location.state?.expired ? (
        <p className="border-l-2 border-warning bg-muted p-3 text-sm" role="status">
          Tu sesión terminó. Ingresa nuevamente para continuar.
        </p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="recepcion@climaauto.rd"
          required
        />
      </div>
      {usingMocks ? (
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
      ) : null}
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
      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {usingMocks ? (
        <p className="text-center text-xs text-muted-foreground">
          Ingresarás como {demoRoles[role].label}. La sesión y los permisos son demostrativos.
        </p>
      ) : null}
    </form>
  )
}

export default Login
