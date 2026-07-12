// Refleja la tabla `historial_tecnico` (id_vehiculo, id_ot, descripcion,
// recomendaciones, registrado_por, fecha_registro).
//
// La base de datos ya tiene la vista vw_historial_clinico_vehiculo, que arma este
// expediente cronológico uniendo el vehículo con sus órdenes cerradas. El backend
// solo tiene que exponerla.
export const historialTecnico = [
  {
    id: 1,
    idVehiculo: 1,
    numeroOrden: 'OT-SDQ-1040',
    fecha: '2026-07-09',
    descripcion: 'Recarga de R-134a y limpieza de evaporador',
    recomendaciones: 'Revisar el filtro de cabina en el próximo servicio.',
    tecnico: 'Ana Rodríguez',
    estado: 'CERRADA',
  },
  {
    id: 2,
    idVehiculo: 1,
    numeroOrden: 'OT-SDQ-0988',
    fecha: '2026-05-14',
    descripcion: 'Detección y sellado de fuga en manguera de baja',
    recomendaciones: 'Vigilar la presión durante los próximos dos meses.',
    tecnico: 'Juan Méndez',
    estado: 'CERRADA',
  },
  {
    id: 3,
    idVehiculo: 2,
    numeroOrden: 'OT-SDQ-0911',
    fecha: '2026-02-02',
    descripcion: 'Mantenimiento preventivo del sistema de climatización',
    recomendaciones: 'Sin hallazgos. Repetir en 12 meses.',
    tecnico: 'Pedro Santos',
    estado: 'CERRADA',
  },
  {
    id: 4,
    idVehiculo: 3,
    numeroOrden: 'OT-SDQ-0854',
    fecha: '2025-11-20',
    descripcion: 'Sustitución del filtro secador',
    recomendaciones: 'Cambiar el aceite PAG en la próxima recarga.',
    tecnico: 'Juan Méndez',
    estado: 'CERRADA',
  },
]
