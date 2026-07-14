import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

function Breadcrumb({ items = [] }) {
  if (!items.length) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li>
          <Link
            to="/app"
            className="inline-flex items-center gap-1 rounded-sm transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="sr-only">Inicio</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {item.to && !isLast ? (
                <Link to={item.to} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && 'font-medium text-foreground')}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
