import PagePlaceholder from './PagePlaceholder'

function Citas() {
  return (
    <PagePlaceholder
      scope="Gestion de Citas"
      title="Citas"
      description="Agenda inicial para recepcion y trabajos programados."
      columns={['Fecha', 'Cliente', 'Vehiculo', 'Motivo']}
    />
  )
}

export default Citas
