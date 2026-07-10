import PagePlaceholder from './PagePlaceholder'

function Diagnosticos() {
  return (
    <PagePlaceholder
      scope="Diagnostico de Refrigeracion"
      title="Diagnosticos"
      description="Evaluaciones tecnicas previas a reparaciones y cierres de orden."
      columns={['Diagnostico', 'Vehiculo', 'Tecnico', 'Resultado']}
    />
  )
}

export default Diagnosticos
