import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import PageHeader from '@/components/common/PageHeader'
import EmptyState from '@/components/common/EmptyState'
import ImagePlaceholder from '@/components/common/ImagePlaceholder'
import LoadingSkeleton from '@/components/common/LoadingSkeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { listarOrdenesTrabajo } from '@/services/ordenesService'
import { guardarDiagnostico } from '@/services/diagnosticosService'
import { usingMocks } from '@/services/dataSource'

// Rangos de referencia para R-134a con el motor en marcha. Orientan al técnico;
// no bloquean nada, porque la lectura correcta depende de la temperatura ambiente.
const rangos = {
  presion_baja: { min: 25, max: 45, label: 'presión baja' },
  presion_alta: { min: 150, max: 250, label: 'presión alta' },
}

const formVacio = {
  presion_baja: '',
  presion_alta: '',
  temperatura: '',
  falla_detectada: '',
  observaciones: '',
}

function fueraDeRango(campo, valor) {
  const rango = rangos[campo]
  if (!rango || valor === '') return null
  const numero = Number(valor)
  if (Number.isNaN(numero)) return null
  if (numero < rango.min) return `La ${rango.label} está por debajo del rango típico.`
  if (numero > rango.max) return `La ${rango.label} está por encima del rango típico.`
  return null
}

function DiagnosticField({ id, label, value, error, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        inputMode="decimal"
        value={value}
        onChange={onChange}
        className="technical-value"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function Diagnosticos() {
  const { sucursalId } = useOutletContext()
  const [ordenes, setOrdenes] = useState([])
  const [ordenId, setOrdenId] = useState('')
  const [form, setForm] = useState(formVacio)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadOrdenes() {
      try {
        const items = await listarOrdenesTrabajo(sucursalId)
        setOrdenes(items)
        setOrdenId(items[0] ? String(items[0].id) : '')
      } catch (loadError) {
        setFeedback(loadError.message || 'No fue posible cargar las órdenes.')
      } finally {
        setIsLoading(false)
      }
    }
    void loadOrdenes()
  }, [sucursalId])

  const orden = ordenes.find((item) => String(item.id) === ordenId)
  const avisos = Object.keys(rangos)
    .map((campo) => fueraDeRango(campo, form[campo]))
    .filter(Boolean)

  function change(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function validate() {
    const nextErrors = {}
    for (const field of ['presion_baja', 'presion_alta', 'temperatura']) {
      if (form[field] === '' || Number.isNaN(Number(form[field])))
        nextErrors[field] = 'Indica una medición numérica.'
    }
    if (!form.falla_detectada.trim()) nextErrors.falla_detectada = 'Describe la falla detectada.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  async function submit(event) {
    event.preventDefault()
    setFeedback('')
    if (!orden || !validate()) return
    setSaving(true)
    try {
      await guardarDiagnostico(orden.id, {
        ...form,
        presion_baja: Number(form.presion_baja),
        presion_alta: Number(form.presion_alta),
        temperatura: Number(form.temperatura),
      })
      setFeedback(
        usingMocks
          ? `Diagnóstico de ${orden.numero} guardado solo en esta demostración.`
          : 'Diagnóstico enviado para guardar.',
      )
      setForm(formVacio)
    } catch (error) {
      setFeedback(error.message || 'No fue posible guardar el diagnóstico.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Evaluación HVAC"
        title="Diagnósticos"
        description="Registro de presiones, temperatura y falla detectada de una orden de trabajo."
      />

      {ordenes.length === 0 ? (
        <EmptyState
          title="No hay órdenes en esta sucursal"
          description="Cambia de sucursal o abre una orden de trabajo antes de registrar un diagnóstico."
        />
      ) : (
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={submit} noValidate>
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-base">Orden a diagnosticar</CardTitle>
              <select
                aria-label="Orden de trabajo"
                className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={ordenId}
                onChange={(event) => setOrdenId(event.target.value)}
              >
                {ordenes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.numero} · {item.vehiculo}
                  </option>
                ))}
              </select>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <DiagnosticField
                id="presion_baja"
                label="Presión baja (PSI)"
                value={form.presion_baja}
                error={errors.presion_baja}
                onChange={change}
              />
              <DiagnosticField
                id="presion_alta"
                label="Presión alta (PSI)"
                value={form.presion_alta}
                error={errors.presion_alta}
                onChange={change}
              />
              <DiagnosticField
                id="temperatura"
                label="Temperatura de salida (°C)"
                value={form.temperatura}
                error={errors.temperatura}
                onChange={change}
              />
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="falla_detectada">Falla detectada</Label>
                <Input
                  id="falla_detectada"
                  name="falla_detectada"
                  value={form.falla_detectada}
                  onChange={change}
                  aria-invalid={Boolean(errors.falla_detectada)}
                  aria-describedby={errors.falla_detectada ? 'falla_detectada-error' : undefined}
                />
                {errors.falla_detectada ? (
                  <p
                    id="falla_detectada-error"
                    className="text-sm font-medium text-destructive"
                    role="alert"
                  >
                    {errors.falla_detectada}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observaciones">Observaciones y recomendación técnica</Label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={form.observaciones}
                  onChange={change}
                  className="min-h-28 w-full border border-input bg-card px-3 py-2"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lecturas fuera de rango</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2" aria-live="polite">
                {avisos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Las mediciones introducidas están dentro del rango típico de R-134a (
                    {rangos.presion_baja.min}–{rangos.presion_baja.max} PSI en baja,{' '}
                    {rangos.presion_alta.min}–{rangos.presion_alta.max} PSI en alta).
                  </p>
                ) : (
                  avisos.map((aviso) => (
                    <Badge key={aviso} variant="warning">
                      {aviso}
                    </Badge>
                  ))
                )}
                <p className="text-sm text-muted-foreground">
                  Son orientaciones: el rango correcto depende de la temperatura ambiente. La
                  decisión y su motivo los documenta el técnico en observaciones.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evidencias</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2">
                <ImagePlaceholder label="Manómetros / presiones" ratio="4/3" />
                <ImagePlaceholder label="Punto de fuga" ratio="4/3" />
              </CardContent>
            </Card>

            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar diagnóstico'}
            </Button>

            {feedback ? (
              <p
                className={
                  feedback.includes('No fue')
                    ? 'text-sm font-medium text-destructive'
                    : 'text-sm font-medium text-success'
                }
                role="status"
              >
                {feedback}
              </p>
            ) : null}
          </div>
        </form>
      )}
    </div>
  )
}

export default Diagnosticos
