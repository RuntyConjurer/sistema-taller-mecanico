import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheckBig,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { branches, services } from '@/data/mocks/landing.mock'
import { crearSolicitudCita } from '@/services/bookingService'
import { usingMocks } from '@/services/dataSource'
import {
  bookingInitialForm,
  bookingSteps,
  loadBookingDraft,
  validateBookingField,
} from '@/utils/bookingValidation'

const steps = [
  { title: 'Vehículo', summary: 'Identifica la unidad' },
  { title: 'Síntoma', summary: 'Qué está ocurriendo' },
  { title: 'Sucursal y fecha', summary: 'Cuándo atenderte' },
  { title: 'Contacto', summary: 'Cómo confirmarte' },
]

function BookingField({ id, label, error, children }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function AgendarCita() {
  const [params] = useSearchParams()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => ({
    ...bookingInitialForm,
    ...loadBookingDraft(),
    servicio: params.get('servicio') || loadBookingDraft().servicio,
  }))
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    window.sessionStorage.setItem('sgtra-booking-draft', JSON.stringify(form))
  }, [form])
  useEffect(() => {
    headingRef.current?.focus()
  }, [step, submitted])

  const summary = useMemo(
    () => [
      form.marca ? `${form.marca} ${form.modelo}` : 'Pendiente',
      services.find((item) => item.id === form.servicio)?.title || 'Pendiente',
      form.fecha ? `${form.fecha} · ${form.hora || 'hora pendiente'}` : 'Pendiente',
      form.nombre || 'Pendiente',
    ],
    [form],
  )

  function validate(name, value = form[name]) {
    const message = validateBookingField(name, value)
    setErrors((current) => ({ ...current, [name]: message }))
    return !message
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function inputProps(name) {
    return {
      id: name,
      name,
      value: form[name],
      onChange: handleChange,
      onBlur: (event) => validate(name, event.target.value),
      'aria-invalid': Boolean(errors[name]),
      'aria-describedby': errors[name] ? `${name}-error` : undefined,
    }
  }

  function next() {
    const valid = bookingSteps[step].every((field) => validate(field))
    if (valid) setStep((current) => current + 1)
  }

  async function submit(event) {
    event.preventDefault()
    if (!bookingSteps.flat().every((field) => validate(field))) return
    setIsSubmitting(true)
    try {
      const appointment = await crearSolicitudCita(form)
      window.sessionStorage.removeItem('sgtra-booking-draft')
      setSubmitted(appointment)
    } catch (error) {
      setErrors({ form: error.message || 'No fue posible preparar la solicitud.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className="public-section">
        <div className="page-container max-w-2xl border border-border bg-card p-8 text-center">
          <CircleCheckBig className="mx-auto h-12 w-12 text-success" aria-hidden="true" />
          <h1 ref={headingRef} tabIndex="-1" className="mt-5 text-3xl font-bold focus:outline-none">
            Solicitud preparada
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Recibimos la solicitud para {submitted.fecha}.{' '}
            {usingMocks
              ? 'Es una demostración local: todavía no se creó una cita real.'
              : 'El equipo revisará los datos antes de confirmarla.'}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              className="inline-flex min-h-11 items-center gap-2 bg-accent px-5 font-semibold"
              href="https://wa.me/18095550142"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle className="h-4 w-4" />
              Confirmar por WhatsApp
            </a>
            <a
              className="inline-flex min-h-11 items-center gap-2 border border-border px-5 font-semibold"
              href="tel:+18095550142"
            >
              <Phone className="h-4 w-4" />
              Llamar
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="public-section">
      <form
        className="page-container grid gap-7 lg:grid-cols-[290px_minmax(0,1fr)]"
        onSubmit={submit}
        noValidate
      >
        <aside className="h-fit border-t-4 border-primary bg-foreground p-5 text-white lg:sticky lg:top-24">
          <p className="eyebrow text-accent">Tu solicitud</p>
          <ol className="mt-7 space-y-5">
            {steps.map((item, index) => (
              <li key={item.title} className="flex gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center border text-xs font-bold ${index < step ? 'border-success bg-success' : index === step ? 'border-accent text-accent' : 'border-slate-600 text-slate-400'}`}
                >
                  {index < step ? <Check className="h-3 w-3" /> : index + 1}
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-300">{summary[index]}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 border-t border-slate-700 pt-4 text-xs text-slate-300">
            Los datos se conservan solo durante esta sesión hasta completar la solicitud.
          </p>
        </aside>
        <section className="border border-border bg-card">
          <header className="border-b border-border p-6">
            <p className="eyebrow">Paso {step + 1} de 4</p>
            <h1
              ref={headingRef}
              tabIndex="-1"
              className="mt-2 text-3xl font-bold focus:outline-none"
            >
              {steps[step].title}
            </h1>
            <p className="mt-2 text-muted-foreground">{steps[step].summary}</p>
          </header>
          <div className="p-6">
            {step === 0 && <VehicleStep errors={errors} inputProps={inputProps} />}
            {step === 1 && <ServiceStep errors={errors} inputProps={inputProps} />}
            {step === 2 && <ScheduleStep errors={errors} inputProps={inputProps} />}
            {step === 3 && <ContactStep errors={errors} inputProps={inputProps} />}
            {errors.form ? (
              <p className="mt-5 text-sm font-medium text-destructive" role="alert">
                {errors.form}
              </p>
            ) : null}
            <div className="mt-8 flex justify-between border-t border-border pt-5">
              <Button
                variant="outline"
                type="button"
                disabled={step === 0}
                onClick={() => setStep((current) => current - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              {step < 3 ? (
                <Button type="button" onClick={next}>
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Preparando…' : 'Preparar solicitud'}{' '}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </section>
      </form>
    </section>
  )
}

function VehicleStep({ errors, inputProps }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <BookingField id="marca" label="Marca" error={errors.marca}>
        <select {...inputProps('marca')} className="h-11 w-full border border-input bg-card px-3">
          <option value="">Selecciona marca</option>
          <option>Toyota</option>
          <option>Honda</option>
          <option>Hyundai</option>
          <option>Kia</option>
          <option>Otra</option>
        </select>
      </BookingField>
      <BookingField id="modelo" label="Modelo" error={errors.modelo}>
        <Input {...inputProps('modelo')} placeholder="Ej. Corolla" />
      </BookingField>
      <BookingField id="anio" label="Año" error={errors.anio}>
        <Input {...inputProps('anio')} inputMode="numeric" maxLength="4" placeholder="AAAA" />
      </BookingField>
      <BookingField id="placa" label="Placa" error={errors.placa}>
        <Input {...inputProps('placa')} className="technical-value" placeholder="AAA-123" />
      </BookingField>
      <div className="sm:col-span-2">
        <BookingField id="chasis" label="Chasis / VIN" error={errors.chasis}>
          <Input
            {...inputProps('chasis')}
            className="technical-value"
            placeholder="Ej. JTDBT923503012345"
          />
        </BookingField>
      </div>
    </div>
  )
}

function ServiceStep({ errors, inputProps }) {
  return (
    <div className="space-y-5">
      <BookingField id="servicio" label="Servicio o síntoma" error={errors.servicio}>
        <select
          {...inputProps('servicio')}
          className="h-11 w-full border border-input bg-card px-3"
        >
          <option value="">Selecciona una opción</option>
          {services.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </BookingField>
      <BookingField id="detalle" label="Describe lo que notas (opcional)" error={errors.detalle}>
        <textarea
          {...inputProps('detalle')}
          rows="5"
          className="w-full border border-input bg-card px-3 py-2"
          placeholder="Ej. enfría poco cuando el vehículo está detenido"
        />
      </BookingField>
    </div>
  )
}

function ScheduleStep({ errors, inputProps }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <BookingField id="sucursal" label="Sucursal" error={errors.sucursal}>
        <select
          {...inputProps('sucursal')}
          className="h-11 w-full border border-input bg-card px-3"
        >
          <option value="">Elige una sucursal</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name} · {branch.city}
            </option>
          ))}
        </select>
      </BookingField>
      <BookingField id="fecha" label="Fecha preferida" error={errors.fecha}>
        <Input {...inputProps('fecha')} type="date" min={new Date().toISOString().slice(0, 10)} />
      </BookingField>
      <BookingField id="hora" label="Franja horaria" error={errors.hora}>
        <select {...inputProps('hora')} className="h-11 w-full border border-input bg-card px-3">
          <option value="">Elige un horario</option>
          <option>8:00 - 10:00</option>
          <option>10:00 - 12:00</option>
          <option>13:00 - 15:00</option>
          <option>15:00 - 17:00</option>
        </select>
      </BookingField>
    </div>
  )
}

function ContactStep({ errors, inputProps }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <BookingField id="nombre" label="Nombre completo" error={errors.nombre}>
        <Input {...inputProps('nombre')} autoComplete="name" />
      </BookingField>
      <BookingField id="documento" label="Documento de identidad / RNC" error={errors.documento}>
        <Input {...inputProps('documento')} className="technical-value" />
      </BookingField>
      <BookingField id="telefono" label="Teléfono" error={errors.telefono}>
        <Input
          {...inputProps('telefono')}
          type="tel"
          autoComplete="tel"
          placeholder="809-000-0000"
        />
      </BookingField>
      <BookingField id="email" label="Correo (opcional)" error={errors.email}>
        <Input {...inputProps('email')} type="email" autoComplete="email" />
      </BookingField>
    </div>
  )
}

export default AgendarCita
