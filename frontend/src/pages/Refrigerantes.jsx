import PagePlaceholder from './PagePlaceholder'

function Refrigerantes() {
  return (
    <PagePlaceholder
      scope="Control de Refrigerantes"
      title="Refrigerantes"
      description="Preparado para registrar consumo y descuentos de inventario."
      columns={['Tipo', 'Cantidad', 'Unidad', 'Ultimo movimiento']}
    />
  )
}

export default Refrigerantes
