import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

function PageHeader({ title, description, eyebrow, action, actionLabel, actionTo, breadcrumbs = [] }) {
  return (
    <header className="border-b border-border pb-6">
      {breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((item, index) => (
            <span key={item.label} className="inline-flex items-center gap-1">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
              {item.to ? (
                <Link to={item.to} className="transition-colors hover:text-primary">
                  {item.label}
                </Link>
              ) : (
                <span className={cn(index === breadcrumbs.length - 1 && 'text-foreground font-medium')}>
                  {item.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p> : null}
        </div>
        {action || actionTo ? (
          <div className="shrink-0">
            {action || (
              <Button asChild>
                <Link to={actionTo}>{actionLabel}</Link>
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default PageHeader
