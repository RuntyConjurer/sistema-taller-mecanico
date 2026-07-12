import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { demoRoles } from '@/constants/demoRoles'

function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState('RECEPCIONISTA')

  function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    window.setTimeout(() => {
      window.sessionStorage.setItem('sgtra-demo-role', role)
      navigate('/app')
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
        <select
          id="rol-demo"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="h-10 w-full rounded border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {Object.entries(demoRoles).map(([code, item]) => (
            <option key={code} value={code}>
              {item.label}
            </option>
          ))}
        </select>
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
