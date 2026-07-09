import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | Taller Refrigeracion` : 'Taller Refrigeracion'
  }, [title])
}
