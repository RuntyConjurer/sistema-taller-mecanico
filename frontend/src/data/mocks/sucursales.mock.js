// Refleja la tabla `sucursales`. Los datos coinciden con database/seeds/001.
//
// El campo `slug` no está hoy en la tabla: lo usa el sitio público para tener URLs
// legibles (/sucursal/central en vez de /sucursal/1). Está solicitado al equipo de
// base de datos; mientras tanto vive aquí. Si finalmente no se añade, el sitio
// público pasará a usar el id numérico y solo cambia esta línea.
//
// `horario` y `tecnicos` tampoco son columnas: son contenido de la web. El backend
// puede devolverlos o no; el frontend los trata como opcionales.
export const sucursales = [
  {
    id: 1,
    slug: 'central',
    nombre: 'Sucursal Central',
    ciudad: 'Santo Domingo',
    direccion: 'Av. 27 de Febrero #150, Distrito Nacional',
    telefono: '809-555-0100',
    email: 'central@refrigeracion.com',
    activa: true,
    horario: 'Lun-Vie 8:00-18:00 · Sáb 8:00-14:00',
    tecnicos: [
      'Juan Méndez · Diagnóstico y recarga',
      'María González · Compresores',
      'Carlos Ruiz · Fugas y sistema eléctrico',
    ],
  },
  {
    id: 2,
    slug: 'norte',
    nombre: 'Sucursal Norte',
    ciudad: 'Santo Domingo',
    direccion: 'Av. Monumental #45, Los Girasoles',
    telefono: '809-555-0101',
    email: 'norte@refrigeracion.com',
    activa: true,
    horario: 'Lun-Vie 8:00-18:00 · Sáb 8:00-13:00',
    tecnicos: ['Ana Rodríguez · Diagnóstico', 'Pedro Santos · Refrigerantes'],
  },
]
