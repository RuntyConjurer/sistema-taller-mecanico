import { useEffect, useState } from 'react'

/**
 * Ejecuta una función que devuelve una promesa y expone el resultado junto con el
 * estado de carga y el error. Evita repetir el mismo useEffect en cada pantalla.
 *
 * `deps` funciona como en useEffect: si cambia (por ejemplo, la sucursal activa),
 * se vuelven a pedir los datos.
 *
 *   const { data, isLoading, error } = useAsyncData(() => listarServicios(), [])
 */
export function useAsyncData(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, isLoading: true, error: '' })

  useEffect(() => {
    // `cancelado` evita escribir en el estado si el componente se desmonta o si las
    // dependencias cambian antes de que llegue la respuesta anterior.
    let cancelado = false

    // Todo el trabajo se difiere a un microtask: llamar a setState de forma síncrona
    // dentro de un efecto provoca renders en cascada (react-hooks/set-state-in-effect).
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
  }, deps)

  return state
}
