import { useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import ImagePlaceholder from '@/components/common/ImagePlaceholder'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ordenes, diagnosticoMock } from '@/data/mocks/ordenes.mock'
import { guardarDiagnostico } from '@/services/diagnosticosService'
import { usingMocks } from '@/services/dataSource'

const initialDiagnostic = {
  presion_baja: diagnosticoMock.presionBaja,
  presion_alta: diagnosticoMock.presionAlta,
  temperatura: diagnosticoMock.temperaturaSalida,
  falla_detectada: diagnosticoMock.falla,
  observaciones: diagnosticoMock.recomendacion,
}

function Diagnosticos() {
  const orden = ordenes[0]
  const [form, setForm] = useState(initialDiagnostic)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)

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
    if (!validate()) return
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
          ? 'Diagnóstico actualizado solo en esta demostración.'
          : 'Diagnóstico enviado para guardar.',
      )
    } catch (error) {
      setFeedback(error.message || 'No fue posible guardar el diagnóstico.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Evaluación HVAC"
        title="Diagnósticos"
        description="Registro técnico de presiones, temperatura, falla y observaciones según el modelo actual."
      />
      <form className="grid gap-4 lg:grid-cols-2" onSubmit={submit} noValidate>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {orden.numero} · {orden.vehiculo}
            </CardTitle>
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
            <div className="rounded border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Datos del esquema actual</p>
              <p className="mt-1">
                La prueba de fugas y la recomendación se documentan en observaciones hasta que
                exista una migración aprobada.
              </p>
            </div>
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
              <CardTitle className="text-base">Alertas informativas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="warning">Presión baja por debajo del rango típico</Badge>
              <p className="text-sm text-muted-foreground">
                Las alertas orientan el diagnóstico; el técnico documenta su decisión en
                observaciones.
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
            {saving ? 'Guardando…' : 'Guardar diagnóstico demo'}
          </Button>
          {feedback ? (
            <p
              className={
                feedback.includes('No fue')
                  ? 'text-sm font-medium text-destructive'
                  : 'text-sm font-medium text-emerald-800'
              }
              role="status"
            >
              {feedback}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  )
}

function DiagnosticField({ id, label, value, error, onChange }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type="number"
        step="0.1"
        value={value}
        onChange={onChange}
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

export default Diagnosticos
