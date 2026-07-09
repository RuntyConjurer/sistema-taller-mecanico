import PagePlaceholder from './PagePlaceholder'

function Clientes() {
  return (
    <PagePlaceholder
      scope="Gestion de Clientes"
      title="Clientes"
      description="Registro y consulta de clientes del taller."
      columns={['Cliente', 'Telefono', 'Correo', 'Estado']}
    />
  )
}

export default Clientes
