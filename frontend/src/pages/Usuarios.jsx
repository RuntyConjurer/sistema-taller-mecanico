import PagePlaceholder from './PagePlaceholder'

function Usuarios() {
  return (
    <PagePlaceholder
      scope="Gestion de Usuarios"
      title="Usuarios"
      description="Preparado para administrar personal y permisos del sistema."
      columns={['Usuario', 'Rol', 'Estado', 'Ultimo acceso']}
    />
  )
}

export default Usuarios
