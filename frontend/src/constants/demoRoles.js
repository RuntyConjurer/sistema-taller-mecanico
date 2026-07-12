// Los códigos coinciden con la tabla `roles` de la base de datos
// (database/seeds/001_seed_configuracion_base.sql). Al integrar el backend, el
// rol llegará en la respuesta del login y estos mismos códigos seguirán sirviendo
// para decidir qué módulos se muestran.
export const demoRoles = {
  RECEPCIONISTA: { label: 'Recepcionista', name: 'Laura Peña' },
  TECNICO: { label: 'Técnico', name: 'Juan Méndez' },
  CAJERO: { label: 'Cajero', name: 'Marta Ruiz' },
  ADMINISTRADOR: { label: 'Administrador', name: 'Sofía Rojas' },
}

export const allDemoRoles = Object.keys(demoRoles)
