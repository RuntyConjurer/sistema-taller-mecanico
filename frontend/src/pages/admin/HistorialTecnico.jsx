import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import StatusBadge from '@/components/domain/StatusBadge'
import { useState } from 'react'
import DetailPanel from '@/components/common/DetailPanel'

const historial = [
  { id: 1, fecha: '2026-07-09', orden: 'OT-SDQ-1040', servicio: 'Recarga + limpieza evaporador', tecnico: 'Ana Rodríguez', estado: 'CERRADA' },
  { id: 2, fecha: '2026-05-14', orden: 'OT-SDQ-0988', servicio: 'Detección de fugas', tecnico: 'Juan Méndez', estado: 'CERRADA' },
  { id: 3, fecha: '2026-02-02', orden: 'OT-SDQ-0911', servicio: 'Mantenimiento preventivo', tecnico: 'Pedro Santos', estado: 'CERRADA' },
]

function HistorialTecnico() {
  const [selected, setSelected] = useState(null)
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Consulta técnica"
        title="Historial Técnico"
        description="Línea de tiempo de reparaciones, diagnósticos y consumos por vehículo."
      />
      <DataTable
        columns={[
          { key: 'fecha', label: 'Fecha' },
          { key: 'orden', label: 'Orden' },
          { key: 'servicio', label: 'Servicio principal' },
          { key: 'tecnico', label: 'Técnico' },
          { key: 'estado', label: 'Estado', render: (row) => <StatusBadge status={row.estado} /> },
        ]}
        rows={historial}
        selectedId={selected?.id}
        onRowSelect={setSelected}
      />
      <DetailPanel open={Boolean(selected)} onClose={() => setSelected(null)} title="Intervención registrada" subtitle={selected?.orden}>
        <p className="text-sm">{selected?.servicio}</p><p className="mt-3 text-sm">Técnico: {selected?.tecnico}</p><p className="mt-3 technical-value">{selected?.fecha}</p>
      </DetailPanel>
    </div>
  )
}

export default HistorialTecnico
