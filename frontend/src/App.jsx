import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    // BrowserRouter activa la navegacion por URL. Gracias a esto, AppRoutes puede
    // decidir que pantalla mostrar cuando cambia la ruta del navegador.
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App
