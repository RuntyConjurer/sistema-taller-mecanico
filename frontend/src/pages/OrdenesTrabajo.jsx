import PagePlaceholder from './PagePlaceholder'

function OrdenesTrabajo() {
  return (
    <PagePlaceholder
      scope="Ordenes de Trabajo"
      title="Ordenes de Trabajo"
      description="Seguimiento operativo de reparaciones, estados y entregas."
      columns={['Orden', 'Vehiculo', 'Diagnostico', 'Factura', 'Estado']}
    />
  )
}

export default OrdenesTrabajo
