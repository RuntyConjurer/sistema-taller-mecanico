import PagePlaceholder from './PagePlaceholder'

function HistorialTecnico() {
  return (
    <PagePlaceholder
      scope="Historial Tecnico"
      title="Historial Tecnico"
      description="Consulta futura de trabajos, diagnosticos y servicios por vehiculo."
      columns={['Vehiculo', 'Servicio', 'Fecha', 'Tecnico']}
    />
  )
}

export default HistorialTecnico
