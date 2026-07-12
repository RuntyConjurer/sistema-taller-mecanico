// Refleja las tablas `usuarios` y `usuario_roles`. Los valores coinciden con
// database/seeds/001_seed_configuracion_base.sql.
// `roles` es un array porque usuario_roles es una relación N:M: un usuario puede
// tener más de un rol. La contraseña nunca viaja al frontend (la tabla guarda
// password_hash y el backend solo lo usa para comparar).
export const usuarios = [
  {
    id: 1,
    nombre: 'Sofía Rojas',
    email: 'sofia.rojas@refrigeracion.com',
    telefono: '809-555-0110',
    idSucursal: 1,
    roles: ['ADMINISTRADOR'],
    activo: true,
  },
  {
    id: 2,
    nombre: 'Juan Méndez',
    email: 'juan.mendez@refrigeracion.com',
    telefono: '809-555-0111',
    idSucursal: 1,
    roles: ['TECNICO'],
    activo: true,
  },
  {
    id: 3,
    nombre: 'Laura Peña',
    email: 'laura.pena@refrigeracion.com',
    telefono: '809-555-0112',
    idSucursal: 2,
    roles: ['RECEPCIONISTA'],
    activo: true,
  },
  {
    id: 4,
    nombre: 'Marta Ruiz',
    email: 'marta.ruiz@refrigeracion.com',
    telefono: '809-555-0113',
    idSucursal: 1,
    roles: ['CAJERO'],
    activo: true,
  },
  {
    id: 5,
    nombre: 'Miguel Reyes',
    email: 'miguel.reyes@refrigeracion.com',
    telefono: '809-555-0114',
    idSucursal: 2,
    roles: ['TECNICO', 'RECEPCIONISTA'],
    activo: false,
  },
]
