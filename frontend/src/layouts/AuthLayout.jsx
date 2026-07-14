import { Outlet } from 'react-router-dom'
import WorkshopMedia from '@/components/common/WorkshopMedia'
import AppLogo from '@/components/brand/AppLogo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usingMocks } from '@/services/dataSource'

function AuthLayout() {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]">
      <div className="relative hidden min-h-screen lg:block">
        <WorkshopMedia className="h-full border-0" priority />
        <div className="absolute inset-0 bg-foreground/80" />
        <div className="absolute inset-x-10 bottom-12 text-white">
          <p className="eyebrow text-accent">Precisión operativa</p>
          <p className="mt-3 max-w-md font-display text-3xl font-semibold">
            Gestión técnica para refrigeración automotriz.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md space-y-8">
          <AppLogo />
          <p className="text-sm text-muted-foreground">
            {usingMocks ? 'Acceso de demostración para operación interna.' : 'Acceso para personal autorizado.'}
          </p>
          <Card>
            <CardHeader>
              <CardTitle>Acceso al sistema</CardTitle>
              <CardDescription>
                {usingMocks ? 'Selecciona un rol para continuar.' : 'Ingresa tus credenciales asignadas.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Outlet />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
