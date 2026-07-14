import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
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
import { enviarNotificacionCita, obtenerEstadoWhatsApp } from '@/services/whatsappService'

function Citas() {
  const { sucursalId, role } = useOutletContext()
  // selected controla la fila marcada y el DetailPanel; feedback/error muestran el
  // resultado de acciones del usuario sin mezclarlo con errores de carga.
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false)
  const [whatsappDelivery, setWhatsappDelivery] = useState(null)

  // La agenda se recarga sola al cambiar de sucursal, y con reload() tras cada acción.
  const {
    data: citas,
    isLoading,
    error: loadError,
    reload,
  } = useAsyncData(() => listarCitas(sucursalId), [sucursalId])
  const {
    data: whatsappConfiguration,
    isLoading: isLoadingWhatsApp,
    error: whatsappConfigurationError,
  } = useAsyncData(() => obtenerEstadoWhatsApp(), [])

  const canNotifyByWhatsApp = ['ADMINISTRADOR', 'RECEPCIONISTA'].includes(role)
  const whatsappAvailable = usingMocks || Boolean(whatsappConfiguration?.configured)
  const isTestTemplate = whatsappConfiguration?.defaultTemplate === 'hello_world'

  async function changeStatus(estado) {
    // Cambiar estado siempre pasa por el service; asi la pantalla no necesita saber
    // si esta usando mockStore o API real.
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
          : `Cita marcada como ${getStateMeta('cita', estado).label.toLowerCase()}.`,
      )
    } catch (actionError) {
      setError(actionError.message || 'No fue posible actualizar la cita.')
    }
  }

  async function convertToWorkOrder() {
    // Esta accion conecta el flujo de agenda con ordenes de trabajo: una cita valida
    // puede transformarse en una OT.
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
          : `${result.workOrder.numero} creada correctamente.`,
      )
    } catch (actionError) {
      setError(actionError.message || 'No fue posible convertir la cita.')
    }
  }

  async function sendWhatsAppNotification() {
    setFeedback('')
    setError('')
    setWhatsappDelivery(null)

    if (!selected) {
      setError('Selecciona una cita antes de enviar la notificación.')
      return
    }
    if (selected.whatsappOptIn !== true) {
      setError('El cliente no ha autorizado notificaciones por WhatsApp.')
      return
    }
    if (!whatsappAvailable) {
      setError('WhatsApp no está configurado en el servidor.')
      return
    }

    setIsSendingWhatsApp(true)
    try {
      const delivery = await enviarNotificacionCita(selected.id, {
        templateName: whatsappConfiguration?.defaultTemplate,
        languageCode: whatsappConfiguration?.defaultLanguage,
      })
      setWhatsappDelivery(delivery)
      setFeedback(
        usingMocks
          ? 'Notificación simulada; no se envió ningún mensaje.'
          : `WhatsApp aceptó el mensaje. Estado: ${delivery.estado}.`,
      )
    } catch (actionError) {
      setError(actionError.message || 'No fue posible enviar la notificación por WhatsApp.')
    } finally {
      setIsSendingWhatsApp(false)
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
          onRowSelect={(appointment) => {
            setSelected(appointment)
            setWhatsappDelivery(null)
            setFeedback('')
            setError('')
          }}
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
        {canNotifyByWhatsApp ? (
          <Button
            size="sm"
            variant="outline"
            onClick={sendWhatsAppNotification}
            disabled={!selected || isSendingWhatsApp || !whatsappAvailable}
            aria-busy={isSendingWhatsApp}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {isSendingWhatsApp
              ? 'Enviando…'
              : isTestTemplate
                ? 'Enviar prueba WhatsApp'
                : 'Enviar confirmación WhatsApp'}
          </Button>
        ) : null}
      </div>
      {canNotifyByWhatsApp && !usingMocks && !isLoadingWhatsApp && !whatsappAvailable ? (
        <p
          className="text-sm text-muted-foreground"
          role={whatsappConfigurationError ? 'alert' : 'status'}
        >
          {whatsappConfigurationError
            ? 'No se pudo consultar la conexión con WhatsApp.'
            : 'WhatsApp no está configurado.'}
        </p>
      ) : null}
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
        <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="font-medium">WhatsApp</dt>
            <dd>{selected?.whatsappOptIn ? 'Autorizado' : 'Sin autorización'}</dd>
          </div>
          {whatsappDelivery ? (
            <>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-medium">Estado del mensaje</dt>
                <dd className="technical-value">{whatsappDelivery.estado}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="font-medium">Plantilla</dt>
                <dd className="technical-value">{whatsappDelivery.plantilla}</dd>
              </div>
            </>
          ) : null}
        </dl>
        {usingMocks ? (
          <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
            Los cambios no se guardan fuera de esta sesión de demostración.
          </p>
        ) : null}
      </DetailPanel>
    </div>
  )
}

export default Citas
