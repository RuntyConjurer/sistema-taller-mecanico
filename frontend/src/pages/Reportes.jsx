import PagePlaceholder from './PagePlaceholder'

function Reportes() {
  return (
    <PagePlaceholder
      scope="Reportes"
      title="Reportes"
      description="Espacio preparado para indicadores operativos y financieros."
      columns={['Reporte', 'Periodo', 'Responsable', 'Estado']}
    />
  )
}

export default Reportes
