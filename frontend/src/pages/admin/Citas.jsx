import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import DetailPanel from '@/components/common/DetailPanel'
import ErrorState from '@/components/common/ErrorState'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { getStateMeta } from '@/constants/domainStates'
import { useAsyncData } from '@/hooks/useAsyncData'
import { actualizarEstadoCita, convertirCitaEnOrden, listarCitas } from '@/services/citasService'
import { usingMocks } from '@/services/dataSource'

function Citas() {
  const { sucursalId } = useOutletContext()
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  // La agenda se recarga sola al cambiar de sucursal, y con reload() tras cada acción.
  const {
    data: citas,
    isLoading,
    error: loadError,
    reload,
  } = useAsyncData(() => listarCitas(sucursalId), [sucursalId])

  async function changeStatus(estado) {
    setFeedback('')
    setError('')
    if (!selected) {
      setError('Selecciona una cita antes de ejecutar una acción.')
      return
    }
    try {
      const updated = await actualizarEstadoCita(selected.id, estado)
      setSelected(updated)
      reload()
      setFeedback(
        usingMocks
          ? `Cita marcada como ${getStateMeta('cita', estado).label.toLowerCase()} solo en la demostración.`
          : 'Estado enviado para actualizar.',
      )
    } catch (actionError) {
      setError(actionError.message || 'No fue posible actualizar la cita.')
    }
  }

  async function convertToWorkOrder() {
    setFeedback('')
    setError('')
    if (!selected) {
      setError('Selecciona una cita antes de convertirla en OT.')
      return
    }
    if (!['PROGRAMADA', 'CONFIRMADA'].includes(selected.estado)) {
      setError('Solo una cita programada o confirmada puede convertirse en OT.')
      return
    }
    try {
      const result = await convertirCitaEnOrden(selected.id)
      setSelected(result.appointment || { ...selected, estado: 'COMPLETADA' })
      reload()
      setFeedback(
        usingMocks
          ? `${result.workOrder.numero} creada solo para la demostración.`
          : 'Conversión enviada para registrar.',
      )
    } catch (actionError) {
      setError(actionError.message || 'No fue posible convertir la cita.')
    }
  }

  if (loadError) return <ErrorState description={loadError} />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agenda"
        title="Citas"
        description="Programación, confirmación y conversión a órdenes de trabajo."
      />
      {isLoading ? (
        <LoadingSkeleton />
      ) : (
        <DataTable
          columns={[
            { key: 'fecha', label: 'Fecha y hora' },
            { key: 'cliente', label: 'Cliente' },
            { key: 'vehiculo', label: 'Vehículo' },
            { key: 'motivo', label: 'Motivo' },
            {
              key: 'estado',
              label: 'Estado',
              render: (row) => {
                const state = getStateMeta('cita', row.estado)
                return <Badge variant={state.tone}>{state.label}</Badge>
              },
            },
          ]}
          rows={citas ?? []}
          selectedId={selected?.id}
          onRowSelect={setSelected}
          emptyMessage="No hay citas en esta sucursal."
        />
      )}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => changeStatus('CONFIRMADA')}>
          Confirmar
        </Button>
        <Button size="sm" variant="outline" onClick={() => changeStatus('CANCELADA')}>
          Cancelar
        </Button>
        <Button size="sm" variant="secondary" onClick={convertToWorkOrder}>
          Convertir a OT
        </Button>
      </div>
      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {feedback ? (
        <p className="text-sm font-medium text-success" role="status">
          {feedback}
        </p>
      ) : null}
      <DetailPanel
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Detalle de cita"
        subtitle={selected?.cliente}
      >
        <p className="technical-value">{selected?.fecha}</p>
        <p className="mt-4 text-sm">{selected?.vehiculo}</p>
        <p className="mt-3 text-sm text-muted-foreground">{selected?.motivo}</p>
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
          Acciones demostrativas: los cambios no se guardan fuera de esta sesión.
        </p>
      </DetailPanel>
    </div>
  )
}

export default Citas
