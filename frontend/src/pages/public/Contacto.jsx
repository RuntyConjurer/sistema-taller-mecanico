import { brand } from '@/constants/brand'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ImagePlaceholder from '@/components/common/ImagePlaceholder'
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useState } from 'react'

function Contacto() {
  const [sent, setSent] = useState(false)

  return (
    <section className="section-padding">
      <div className="page-container grid gap-12 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="eyebrow">Contacto</p>
          <h1 className="mt-3 text-4xl font-bold">Habla con el taller</h1>
          <p className="mt-4 max-w-[56ch] text-muted-foreground">
            Para una cita, usa la agenda. Para una consulta, deja tus datos aquí.
          </p>
          <form
            className="mt-10 space-y-5 border-y border-border py-6"
            onSubmit={(event) => {
              event.preventDefault()
              setSent(true)
            }}
          >
            <ContactField id="nombre" label="Nombre completo" placeholder="Tu nombre" />
            <ContactField id="telefono" label="Teléfono" placeholder="809-000-0000" type="tel" />
            <ContactField id="vehiculo" label="Vehículo" placeholder="Marca, modelo y año" />
            <ContactField id="motivo" label="Motivo de visita" placeholder="Ej. Aire no enfría" />
            <Button type="submit">Enviar consulta</Button>
            {sent ? (
              <p className="text-sm font-medium text-success" role="status">
                Consulta preparada. El envío se conectará al backend cuando esté disponible.
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                El formulario no envía datos fuera de esta demostración.
              </p>
            )}
          </form>
          <Link
            to="/agendar-cita"
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary"
          >
            Ir a la agenda guiada →
          </Link>
        </div>
        <aside className="space-y-6">
          <ImagePlaceholder label="Ubicación del taller" ratio="16/9" />
          <dl className="divide-y divide-border border-y border-border">
            <ContactDetail icon={MapPin} label="Dirección" value={brand.address} />
            <ContactDetail icon={Phone} label="Teléfono" value={brand.phone} />
            <ContactDetail icon={Mail} label="Correo" value={brand.email} />
            <ContactDetail icon={Clock} label="Horario" value={brand.hours} />
          </dl>
          <a
            className="inline-flex min-h-11 items-center gap-2 font-semibold text-primary"
            href="https://wa.me/18095550142"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Abrir WhatsApp
          </a>
        </aside>
      </div>
    </section>
  )
}

function ContactField({ id, label, placeholder, type = 'text' }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} />
    </div>
  )
}

function ContactDetail({ icon: Icon, label, value }) {
  return (
    <div className="grid grid-cols-[20px_112px_1fr] gap-3 py-4 text-sm">
      <Icon className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
      <dt className="font-semibold">{label}</dt>
      <dd className="text-muted-foreground">{value}</dd>
    </div>
  )
}

export default Contacto
