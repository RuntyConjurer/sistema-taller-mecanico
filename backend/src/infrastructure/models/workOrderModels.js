'use strict';

const { DataTypes, modelOptions, id, fk } = require('./modelHelpers');

function defineWorkOrderModels(sequelize) {
  const OrdenTrabajo = sequelize.define('OrdenTrabajo', {
    id: id('id_ot'), vehiculoId: fk('id_vehiculo', false), tecnicoId: fk('id_usuario'), sucursalId: fk('id_sucursal'), citaId: fk('id_cita'),
    cotizacionId: fk('id_cotizacion'), estado: DataTypes.STRING(20), descripcionProblema: { type: DataTypes.TEXT, field: 'descripcion_problema' },
    observaciones: DataTypes.TEXT, fechaApertura: { type: DataTypes.DATE, field: 'fecha_apertura' }, fechaCierre: { type: DataTypes.DATE, field: 'fecha_cierre' },
  }, modelOptions(sequelize, 'ordenes_trabajo'));

  const Diagnostico = sequelize.define('Diagnostico', {
    id: id('id_diagnostico'), ordenTrabajoId: fk('id_ot', false), presionBaja: { type: DataTypes.DECIMAL(6, 2), field: 'presion_baja' },
    presionAlta: { type: DataTypes.DECIMAL(6, 2), field: 'presion_alta' }, temperatura: DataTypes.DECIMAL(5, 2),
    fallaDetectada: { type: DataTypes.TEXT, field: 'falla_detectada' }, observaciones: DataTypes.TEXT,
    creadoPor: fk('creado_por'), fechaDiagnostico: { type: DataTypes.DATE, field: 'fecha_diagnostico' },
  }, modelOptions(sequelize, 'diagnosticos'));

  const OrdenServicio = sequelize.define('OrdenServicio', {
    id: id('id_ot_servicio'), ordenTrabajoId: fk('id_ot', false), servicioId: fk('id_servicio', false), cantidad: DataTypes.DECIMAL(8, 2),
    precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' }, subtotal: DataTypes.DECIMAL(14, 2),
  }, modelOptions(sequelize, 'orden_trabajo_servicios'));

  const OrdenMaterial = sequelize.define('OrdenMaterial', {
    id: id('id_ot_material'), ordenTrabajoId: fk('id_ot', false), materialId: fk('id_material', false), cantidad: DataTypes.DECIMAL(12, 2),
    precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' }, subtotal: DataTypes.DECIMAL(14, 2),
    registradoPor: fk('registrado_por'), creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
  }, modelOptions(sequelize, 'orden_trabajo_materiales'));

  const Historial = sequelize.define('Historial', {
    id: id('id_historial'), vehiculoId: fk('id_vehiculo', false), ordenTrabajoId: fk('id_ot', false), descripcion: DataTypes.TEXT,
    recomendaciones: DataTypes.TEXT, registradoPor: fk('registrado_por'), fechaRegistro: { type: DataTypes.DATE, field: 'fecha_registro' },
  }, modelOptions(sequelize, 'historial_tecnico'));

  return { OrdenTrabajo, Diagnostico, OrdenServicio, OrdenMaterial, Historial };
}

module.exports = { defineWorkOrderModels };
