import PagePlaceholder from './PagePlaceholder'

function Servicios() {
  return (
    <PagePlaceholder
      scope="Catalogo"
      title="Servicios"
      description="Base para servicios ofrecidos por el taller."
      columns={['Servicio', 'Categoria', 'Precio base', 'Estado']}
    />
  )
}

export default Servicios
