import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, CircleDot, XCircle } from 'lucide-react'
import { getStateMeta } from '@/constants/domainStates'
import { otStatuses } from '@/constants/otStatuses'

// `group` elige el diccionario de estados: 'ot' por defecto, o cualquiera de los
// declarados en domainStates ('cita', 'factura', 'stock').
function StatusBadge({ status, group = 'ot' }) {
  const config =
    group === 'ot'
      ? otStatuses[status] || { label: status, tone: 'muted' }
      : getStateMeta(group, status)
  const Icon =
    config.tone === 'success'
      ? CheckCircle2
      : config.tone === 'warning'
        ? AlertTriangle
        : config.tone === 'danger'
          ? XCircle
          : CircleDot
  return (
    <Badge variant={config.tone}>
      <Icon className="mr-1 h-3 w-3" aria-hidden="true" />
      {config.label}
    </Badge>
  )
}

export default StatusBadge
