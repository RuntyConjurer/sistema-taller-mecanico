import PagePlaceholder from './PagePlaceholder'

function Facturacion() {
  return (
    <PagePlaceholder
      scope="Facturacion"
      title="Facturacion"
      description="Base para facturas, pagos y control de saldos pendientes."
      columns={['Factura', 'Cliente', 'Total', 'Pago', 'Estado']}
    />
  )
}

export default Facturacion
