import PagePlaceholder from './PagePlaceholder'

function Vehiculos() {
  return (
    <PagePlaceholder
      scope="Gestion de Vehiculos"
      title="Vehiculos"
      description="Vehiculos registrados y vinculados a clientes existentes."
      columns={['Placa', 'Marca', 'Modelo', 'Cliente']}
    />
  )
}

export default Vehiculos
