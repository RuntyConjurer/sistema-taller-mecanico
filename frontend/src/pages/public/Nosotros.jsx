import { brand } from '@/constants/brand'
import WorkshopMedia from '@/components/common/WorkshopMedia'

function Nosotros() {
  const principles = [
    ['01', 'Precisión', 'Mediciones visibles, unidades claras y recomendaciones entendibles.'],
    ['02', 'Transparencia', 'Explicamos el hallazgo antes de proponer una intervención.'],
    ['03', 'Trazabilidad', 'El historial técnico conserva el contexto de cada vehículo.'],
  ]
  return <><section className="border-b border-border bg-muted"><div className="page-container grid gap-8 py-16 lg:grid-cols-2"><div><p className="eyebrow">Sobre SGTRA</p><h1 className="mt-3 text-4xl font-bold">Técnica clara para decisiones más seguras.</h1><p className="mt-5 max-w-xl leading-7 text-muted-foreground">{brand.name} organiza el diagnóstico, la reparación y el seguimiento del sistema de climatización automotriz en un proceso que el cliente puede entender.</p></div><WorkshopMedia className="h-72"/></div></section><section className="public-section"><div className="page-container"><div className="divide-y divide-border border-y border-border">{principles.map(([number, title, text]) => <article key={title} className="grid gap-5 py-7 md:grid-cols-[80px_220px_1fr]"><span className="technical-value text-primary">{number}</span><h2 className="font-display text-2xl font-semibold">{title}</h2><p className="max-w-xl text-muted-foreground">{text}</p></article>)}</div></div></section></>
}

export default Nosotros
