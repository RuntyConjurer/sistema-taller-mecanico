import { useCallback, useEffect, useState } from 'react'

/**
 * Carga datos de un service y expone el resultado con su estado de carga y error.
 * Es el único patrón de carga de datos del proyecto: antes cada pantalla repetía
 * este mismo useEffect con su try/catch y sus tres useState.
 *
 *   const { data, isLoading, error, reload } = useAsyncData(() => listarClientes(), [])
 *
 * `deps` funciona como en useEffect: si cambia (por ejemplo, la sucursal activa), se
 * vuelven a pedir los datos.
 *
 * `reload` sirve para volver a pedirlos después de una acción que los modifica
 * (registrar un pago, cerrar una orden, consumir refrigerante).
 */
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, isLoading: true, error: '' })
  const [intento, setIntento] = useState(0)

  const reload = useCallback(() => setIntento((n) => n + 1), [])

  useEffect(() => {
    // Si el componente se desmonta, o las dependencias cambian antes de que llegue la
    // respuesta anterior, esa respuesta se descarta en lugar de pisar la nueva.
    let cancelado = false

    // El trabajo se difiere a un microtask: llamar a setState de forma síncrona dentro
    // de un efecto provoca renders en cascada (regla react-hooks/set-state-in-effect).
    Promise.resolve()
      .then(() => {
        if (!cancelado) setState((current) => ({ ...current, isLoading: true }))
        return fetcher()
      })
      .then((data) => {
        if (!cancelado) setState({ data, isLoading: false, error: '' })
      })
      .catch((error) => {
        if (!cancelado) {
          setState({ data: null, isLoading: false, error: error.message || 'No se pudo cargar.' })
        }
      })

    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, intento])

  return { ...state, reload }
}
