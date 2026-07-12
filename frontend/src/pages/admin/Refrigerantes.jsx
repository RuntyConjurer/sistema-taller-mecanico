import { useEffect, useState } from 'react'
import PageHeader from '@/components/common/PageHeader'
import DataTable from '@/components/common/DataTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Snowflake, Droplets } from 'lucide-react'
import { listarOrdenesParaConsumo, listarRefrigerantes, registrarConsumoRefrigerante } from '@/services/inventarioService'
import { usingMocks } from '@/services/dataSource'

function levelPercent(existencia) {
  const value = Number.parseFloat(existencia)
  return Number.isNaN(value) ? 0 : Math.min(100, Math.round((value / 15) * 100))
}

function Refrigerantes() {
  const [refrigerantes, setRefrigerantes] = useState([])
  const [ordenes, setOrdenes] = useState([])
  const [consumo, setConsumo] = useState({ ordenId: '', refrigeranteId: '', cantidad: '' })
  const [feedback, setFeedback] = useState('')
  const [error, setError] = useState('')

  async function loadData() {
    try {
      const [items, orders] = await Promise.all([listarRefrigerantes(), listarOrdenesParaConsumo()])
      setRefrigerantes(items)
      setOrdenes(orders)
    } catch (loadError) {
      setError(loadError.message || 'No fue posible cargar los refrigerantes.')
    }
  }

  useEffect(() => { void Promise.resolve().then(loadData) }, [])

  async function submit(event) {
    event.preventDefault()
    setFeedback('')
    setError('')
    if (!consumo.ordenId || !consumo.refrigeranteId || !consumo.cantidad) {
      setError('Selecciona una orden, un refrigerante y la cantidad consumida.')
      return
    }
    try {
      const result = await registrarConsumoRefrigerante(consumo)
      await loadData()
      setFeedback(usingMocks ? `Consumo demo registrado. Stock restante: ${result.remaining} kg.` : 'Consumo enviado para registrar.')
      setConsumo((current) => ({ ...current, cantidad: '' }))
    } catch (submitError) {
      setError(submitError.message || 'No fue posible registrar el consumo.')
    }
  }

  return <div className="space-y-6"><PageHeader eyebrow="Control especializado" title="Refrigerantes" description="Existencia por tipo, consumo por orden y trazabilidad de recargas." />
    <div className="grid gap-4 md:grid-cols-2">{refrigerantes.map((item) => { const percent = levelPercent(item.existencia); return <Card key={item.id}><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-base">{item.tipo}</CardTitle><div className="bg-secondary p-2 text-primary"><Snowflake className="h-4 w-4" aria-hidden="true" /></div></CardHeader><CardContent className="space-y-3"><p className="text-2xl font-bold">{item.existencia}</p><p className="text-xs text-muted-foreground">{item.consumoMes} consumidos este mes · {item.ordenes} órdenes</p><div><div className="mb-1 flex justify-between text-xs text-muted-foreground"><span>Nivel estimado</span><span>{percent}%</span></div><div className="h-2 overflow-hidden bg-muted" role="meter" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={`Nivel de ${item.tipo}`}><div className={percent < 35 ? 'h-full bg-amber-800' : 'h-full bg-primary'} style={{ width: `${percent}%` }} /></div></div></CardContent></Card> })}</div>
    <DataTable columns={[{ key: 'tipo', label: 'Tipo' }, { key: 'existencia', label: 'Existencia' }, { key: 'consumoMes', label: 'Consumo del mes' }, { key: 'ordenes', label: 'Órdenes' }]} rows={refrigerantes} />
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Droplets className="h-4 w-4 text-primary" />Registrar recarga</CardTitle><p className="text-sm text-muted-foreground">La demostración valida stock local; el backend y su trigger validarán el consumo definitivo.</p></CardHeader><CardContent><form className="grid gap-4 md:grid-cols-4" onSubmit={submit} noValidate><div className="space-y-2"><Label htmlFor="ordenId">Orden de trabajo</Label><select id="ordenId" value={consumo.ordenId} onChange={(event) => setConsumo((current) => ({ ...current, ordenId: event.target.value }))} className="h-10 w-full border border-input bg-card px-3"><option value="">Selecciona OT</option>{ordenes.map((order) => <option key={order.id} value={order.id}>{order.numero} · {order.vehiculo}</option>)}</select></div><div className="space-y-2"><Label htmlFor="refrigeranteId">Refrigerante</Label><select id="refrigeranteId" value={consumo.refrigeranteId} onChange={(event) => setConsumo((current) => ({ ...current, refrigeranteId: event.target.value }))} className="h-10 w-full border border-input bg-card px-3"><option value="">Selecciona refrigerante</option>{refrigerantes.map((item) => <option key={item.id} value={item.id}>{item.tipo} · {item.existencia}</option>)}</select></div><div className="space-y-2"><Label htmlFor="cantidad">Cantidad (kg)</Label><input id="cantidad" type="number" step="0.01" min="0.01" value={consumo.cantidad} onChange={(event) => setConsumo((current) => ({ ...current, cantidad: event.target.value }))} className="h-10 w-full border border-input bg-card px-3" /></div><div className="flex items-end"><Button className="w-full" type="submit">Registrar consumo demo</Button></div></form>{error ? <p className="mt-4 text-sm font-medium text-destructive" role="alert">{error}</p> : null}{feedback ? <p className="mt-4 text-sm font-medium text-emerald-800" role="status">{feedback}</p> : null}</CardContent></Card>
  </div>
}

export default Refrigerantes
