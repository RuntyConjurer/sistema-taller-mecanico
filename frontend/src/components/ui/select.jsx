import { cn } from '@/lib/utils'

// Un <select> nativo del navegador con el estilo del sistema aplicado una sola vez.
// No usa librería: el select nativo ya es accesible con teclado y funciona bien en
// móvil, así que envolverlo en un componente de terceros solo añadiría dependencias.
function Select({ className, children, ...props }) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-md border border-input bg-card px-3 text-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
