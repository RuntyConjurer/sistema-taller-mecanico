import { cn } from '@/lib/utils'

function StatCard({ title, value, hint, icon: Icon, tone = 'default', className }) {
  const toneClasses = {
    default: 'border-primary',
    success: 'border-emerald-800',
    warning: 'border-amber-800',
    danger: 'border-destructive',
  }

  return <dl className={cn('border-l-2 px-5 py-4', toneClasses[tone], className)}>
    <div className="flex items-center justify-between gap-3"><dt className="text-sm font-medium text-muted-foreground">{title}</dt>{Icon ? <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" /> : null}</div>
    <dd className="mt-3 font-display text-3xl font-semibold tracking-tight">{value}</dd>
    {hint ? <dd className="mt-1 text-xs text-muted-foreground">{hint}</dd> : null}
  </dl>
}

export default StatCard
