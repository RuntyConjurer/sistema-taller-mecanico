import { BrowserRouter } from 'react-router-dom'
import RouteErrorBoundary from '@/components/common/RouteErrorBoundary'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    // BrowserRouter activa la navegacion por URL. Gracias a esto, AppRoutes puede
    // decidir que pantalla mostrar cuando cambia la ruta del navegador.
    <BrowserRouter>
      <RouteErrorBoundary>
        <AppRoutes />
      </RouteErrorBoundary>
    </BrowserRouter>
  )
}

export default App
