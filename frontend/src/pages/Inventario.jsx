import PagePlaceholder from './PagePlaceholder'

function Inventario() {
  return (
    <PagePlaceholder
      scope="Inventario"
      title="Inventario"
      description="Control inicial de piezas, repuestos e insumos."
      columns={['Articulo', 'Categoria', 'Existencia', 'Minimo']}
    />
  )
}

export default Inventario
