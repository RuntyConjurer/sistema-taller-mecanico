import { Badge } from '@/components/ui/badge'
import { AlertTriangle, CheckCircle2, CircleDot, XCircle } from 'lucide-react'
import { otStatuses } from '@/constants/otStatuses'

function StatusBadge({ status }) {
  const config = otStatuses[status] || { label: status, tone: 'muted' }
  const Icon = config.tone === 'success' ? CheckCircle2 : config.tone === 'warning' ? AlertTriangle : config.tone === 'danger' ? XCircle : CircleDot
  return <Badge variant={config.tone}><Icon className="mr-1 h-3 w-3" aria-hidden="true" />{config.label}</Badge>
}

export default StatusBadge
