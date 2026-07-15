import { Component } from 'react'
import { useLocation } from 'react-router-dom'
import ErrorState from '@/components/common/ErrorState'

class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error) {
    console.error(error)
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title="No se pudo mostrar esta pantalla"
          description={this.state.error.message || 'Ocurrió un error al cargar el módulo.'}
          actionLabel="Recargar"
          onAction={() => window.location.reload()}
        />
      )
    }

    return this.props.children
  }
}

function RouteErrorBoundary({ children }) {
  const location = useLocation()
  return <ErrorBoundary resetKey={location.pathname}>{children}</ErrorBoundary>
}

export default RouteErrorBoundary
