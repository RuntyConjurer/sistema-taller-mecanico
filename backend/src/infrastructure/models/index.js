'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const options = (tableName) => ({ sequelize, tableName, timestamps: false });
const id = (field) => ({ type: DataTypes.BIGINT, field, primaryKey: true, autoIncrement: true });
const fk = (field, allowNull = true) => ({ type: DataTypes.BIGINT, field, allowNull });
const money = (field, allowNull = false) => ({ type: DataTypes.DECIMAL(14, 2), field, allowNull });

const Sucursal = sequelize.define('Sucursal', {
  id: id('id_sucursal'), nombre: { type: DataTypes.STRING(100), allowNull: false }, direccion: { type: DataTypes.TEXT, allowNull: false },
  telefono: DataTypes.STRING(20), email: DataTypes.STRING(120), activa: DataTypes.BOOLEAN, creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('sucursales'));

const Rol = sequelize.define('Rol', {
  id: id('id_rol'), nombre: { type: DataTypes.STRING(50), allowNull: false }, descripcion: DataTypes.TEXT, activo: DataTypes.BOOLEAN,
}, options('roles'));

const Usuario = sequelize.define('Usuario', {
  id: id('id_usuario'), sucursalId: fk('id_sucursal'), tipoIdentificacion: { type: DataTypes.STRING(15), field: 'tipo_identificacion' },
  identificacion: DataTypes.STRING(20), nombre: DataTypes.STRING(120), email: DataTypes.STRING(120),
  passwordHash: { type: DataTypes.TEXT, field: 'password_hash' }, telefono: DataTypes.STRING(20), activo: DataTypes.BOOLEAN,
  creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('usuarios'));

const UsuarioRol = sequelize.define('UsuarioRol', {
  usuarioId: { ...fk('id_usuario', false), primaryKey: true }, rolId: { ...fk('id_rol', false), primaryKey: true },
}, options('usuario_roles'));

const Cliente = sequelize.define('Cliente', {
  id: id('id_cliente'), tipoCliente: { type: DataTypes.STRING(10), field: 'tipo_cliente' },
  tipoIdentificacion: { type: DataTypes.STRING(15), field: 'tipo_identificacion' }, identificacion: DataTypes.STRING(20),
  nombre: DataTypes.STRING(150), telefono: DataTypes.STRING(20), direccion: DataTypes.STRING(250), email: DataTypes.STRING(100),
  activo: DataTypes.BOOLEAN, creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('clientes'));

const Vehiculo = sequelize.define('Vehiculo', {
  id: id('id_vehiculo'), clienteId: fk('id_cliente', false), chasis: DataTypes.STRING(50), marca: DataTypes.STRING(80),
  modelo: DataTypes.STRING(80), placa: DataTypes.STRING(20), color: DataTypes.STRING(50), anio: DataTypes.SMALLINT,
  tipoRefrigerante: { type: DataTypes.STRING(60), field: 'tipo_refrigerante' }, activo: DataTypes.BOOLEAN,
  creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('vehiculos'));

const Servicio = sequelize.define('Servicio', {
  id: id('id_servicio'), nombre: DataTypes.STRING(150), descripcion: DataTypes.TEXT,
  precioBase: { type: DataTypes.DECIMAL(12, 2), field: 'precio_base' },
  porcentajeImpuesto: { type: DataTypes.DECIMAL(5, 2), field: 'porcentaje_impuesto' }, activo: DataTypes.BOOLEAN,
  creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('servicios'));

const Cita = sequelize.define('Cita', {
  id: id('id_cita'), clienteId: fk('id_cliente', false), vehiculoId: fk('id_vehiculo', false), sucursalId: fk('id_sucursal'),
  servicioId: fk('id_servicio'), fechaCita: { type: DataTypes.DATE, field: 'fecha_cita' }, estado: DataTypes.STRING(20),
  motivo: DataTypes.STRING(250), observaciones: DataTypes.TEXT, creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('citas'));

const Cotizacion = sequelize.define('Cotizacion', {
  id: id('id_cotizacion'), clienteId: fk('id_cliente', false), vehiculoId: fk('id_vehiculo', false), sucursalId: fk('id_sucursal'),
  numero: DataTypes.STRING(30), estado: DataTypes.STRING(20), subtotal: money('subtotal'), impuesto: money('impuesto'),
  descuento: money('descuento'), total: money('total'), observaciones: DataTypes.TEXT, vigencia: DataTypes.DATEONLY,
  creadoPor: fk('creado_por'), creadoEn: { type: DataTypes.DATE, field: 'creado_en' }, actualizadoEn: { type: DataTypes.DATE, field: 'actualizado_en' },
}, options('cotizaciones'));

const CotizacionDetalle = sequelize.define('CotizacionDetalle', {
  id: id('id_cotizacion_detalle'), cotizacionId: fk('id_cotizacion', false), servicioId: fk('id_servicio'),
  materialId: fk('id_material'), tipoItem: { type: DataTypes.STRING(20), field: 'tipo_item' }, descripcion: DataTypes.STRING(150),
  cantidad: DataTypes.DECIMAL(12, 2), precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' },
  subtotal: DataTypes.DECIMAL(14, 2), porcentajeImpuesto: { type: DataTypes.DECIMAL(5, 2), field: 'porcentaje_impuesto' },
  montoImpuesto: { type: DataTypes.DECIMAL(14, 2), field: 'monto_impuesto' },
}, options('cotizacion_detalles'));

const OrdenTrabajo = sequelize.define('OrdenTrabajo', {
  id: id('id_ot'), vehiculoId: fk('id_vehiculo', false), tecnicoId: fk('id_usuario'), sucursalId: fk('id_sucursal'), citaId: fk('id_cita'),
  cotizacionId: fk('id_cotizacion'), estado: DataTypes.STRING(20), descripcionProblema: { type: DataTypes.TEXT, field: 'descripcion_problema' },
  observaciones: DataTypes.TEXT, fechaApertura: { type: DataTypes.DATE, field: 'fecha_apertura' }, fechaCierre: { type: DataTypes.DATE, field: 'fecha_cierre' },
}, options('ordenes_trabajo'));

const Diagnostico = sequelize.define('Diagnostico', {
  id: id('id_diagnostico'), ordenTrabajoId: fk('id_ot', false), presionBaja: { type: DataTypes.DECIMAL(6, 2), field: 'presion_baja' },
  presionAlta: { type: DataTypes.DECIMAL(6, 2), field: 'presion_alta' }, temperatura: DataTypes.DECIMAL(5, 2),
  fallaDetectada: { type: DataTypes.TEXT, field: 'falla_detectada' }, observaciones: DataTypes.TEXT,
  creadoPor: fk('creado_por'), fechaDiagnostico: { type: DataTypes.DATE, field: 'fecha_diagnostico' },
}, options('diagnosticos'));

const OrdenServicio = sequelize.define('OrdenServicio', {
  id: id('id_ot_servicio'), ordenTrabajoId: fk('id_ot', false), servicioId: fk('id_servicio', false), cantidad: DataTypes.DECIMAL(8, 2),
  precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' }, subtotal: DataTypes.DECIMAL(14, 2),
}, options('orden_trabajo_servicios'));

const Material = sequelize.define('Material', {
  id: id('id_material'), nombre: DataTypes.STRING(100), descripcion: DataTypes.TEXT, categoria: DataTypes.STRING(30),
  unidadMedida: { type: DataTypes.STRING(30), field: 'unidad_medida' }, stockActual: { type: DataTypes.DECIMAL(12, 2), field: 'stock_actual' },
  stockMinimo: { type: DataTypes.DECIMAL(12, 2), field: 'stock_minimo' }, costoUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'costo_unitario' },
  precioVenta: { type: DataTypes.DECIMAL(12, 2), field: 'precio_venta' }, activo: DataTypes.BOOLEAN,
}, options('materiales'));

const OrdenMaterial = sequelize.define('OrdenMaterial', {
  id: id('id_ot_material'), ordenTrabajoId: fk('id_ot', false), materialId: fk('id_material', false), cantidad: DataTypes.DECIMAL(12, 2),
  precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' }, subtotal: DataTypes.DECIMAL(14, 2),
  registradoPor: fk('registrado_por'), creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('orden_trabajo_materiales'));

const InventarioMovimiento = sequelize.define('InventarioMovimiento', {
  id: id('id_movimiento'), materialId: fk('id_material', false), tipoMovimiento: { type: DataTypes.STRING(20), field: 'tipo_movimiento' },
  cantidad: DataTypes.DECIMAL(12, 2), costoUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'costo_unitario' }, motivo: DataTypes.TEXT,
  usuarioId: fk('id_usuario'), fechaMovimiento: { type: DataTypes.DATE, field: 'fecha_movimiento' },
}, options('inventario_movimientos'));

const Factura = sequelize.define('Factura', {
  id: id('id_factura'), numeroFactura: { type: DataTypes.STRING(30), field: 'numero_factura' }, fecha: DataTypes.DATE,
  subtotal: money('subtotal'), impuesto: money('impuesto'), descuento: money('descuento'), total: money('total'), estado: DataTypes.STRING(20),
  observaciones: DataTypes.TEXT, creadoPor: fk('creado_por'), creadoEn: { type: DataTypes.DATE, field: 'creado_en' },
}, options('facturas'));

const FacturaOrden = sequelize.define('FacturaOrden', {
  facturaId: { ...fk('id_factura', false), primaryKey: true }, ordenTrabajoId: { ...fk('id_ot', false), primaryKey: true },
}, options('factura_ordenes_trabajo'));

const FacturaDetalle = sequelize.define('FacturaDetalle', {
  id: id('id_factura_detalle'), facturaId: fk('id_factura', false), ordenTrabajoId: fk('id_ot'), tipoItem: { type: DataTypes.STRING(20), field: 'tipo_item' },
  descripcion: DataTypes.STRING(150), cantidad: DataTypes.DECIMAL(12, 2), precioUnitario: { type: DataTypes.DECIMAL(12, 2), field: 'precio_unitario' },
  subtotal: DataTypes.DECIMAL(14, 2), porcentajeImpuesto: { type: DataTypes.DECIMAL(5, 2), field: 'porcentaje_impuesto' },
  montoImpuesto: { type: DataTypes.DECIMAL(14, 2), field: 'monto_impuesto' },
}, options('factura_detalles'));

const Pago = sequelize.define('Pago', {
  id: id('id_pago'), montoTotal: { type: DataTypes.DECIMAL(14, 2), field: 'monto_total' }, formaPago: { type: DataTypes.STRING(30), field: 'forma_pago' },
  referencia: DataTypes.STRING(100), fechaPago: { type: DataTypes.DATE, field: 'fecha_pago' }, recibidoPor: fk('recibido_por'),
}, options('pagos'));

const PagoFactura = sequelize.define('PagoFactura', {
  id: id('id_pago_factura'), pagoId: fk('id_pago', false), facturaId: fk('id_factura', false),
  montoAplicado: { type: DataTypes.DECIMAL(14, 2), field: 'monto_aplicado' },
}, options('pago_facturas'));

const Historial = sequelize.define('Historial', {
  id: id('id_historial'), vehiculoId: fk('id_vehiculo', false), ordenTrabajoId: fk('id_ot', false), descripcion: DataTypes.TEXT,
  recomendaciones: DataTypes.TEXT, registradoPor: fk('registrado_por'), fechaRegistro: { type: DataTypes.DATE, field: 'fecha_registro' },
}, options('historial_tecnico'));

Cliente.hasMany(Vehiculo, { foreignKey: 'clienteId', as: 'vehiculos' }); Vehiculo.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Cliente.hasMany(Cita, { foreignKey: 'clienteId', as: 'citas' }); Cita.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
Vehiculo.hasMany(Cita, { foreignKey: 'vehiculoId', as: 'citas' }); Cita.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });
Sucursal.hasMany(Cita, { foreignKey: 'sucursalId', as: 'citas' }); Cita.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });
Cita.belongsTo(Servicio, { foreignKey: 'servicioId', as: 'servicio' });
Usuario.belongsToMany(Rol, { through: UsuarioRol, foreignKey: 'usuarioId', otherKey: 'rolId', as: 'roles' });
OrdenTrabajo.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' }); OrdenTrabajo.belongsTo(Cita, { foreignKey: 'citaId', as: 'cita' });
OrdenTrabajo.belongsTo(Usuario, { foreignKey: 'tecnicoId', as: 'tecnico' });
OrdenTrabajo.hasOne(Diagnostico, { foreignKey: 'ordenTrabajoId', as: 'diagnostico' });
OrdenTrabajo.hasMany(OrdenServicio, { foreignKey: 'ordenTrabajoId', as: 'servicios' }); OrdenServicio.belongsTo(Servicio, { foreignKey: 'servicioId', as: 'servicio' });
OrdenTrabajo.hasMany(OrdenMaterial, { foreignKey: 'ordenTrabajoId', as: 'materiales' }); OrdenMaterial.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });
Factura.hasMany(FacturaDetalle, { foreignKey: 'facturaId', as: 'detalles' }); Factura.hasMany(PagoFactura, { foreignKey: 'facturaId', as: 'aplicacionesPago' });
Factura.belongsToMany(OrdenTrabajo, { through: FacturaOrden, foreignKey: 'facturaId', otherKey: 'ordenTrabajoId', as: 'ordenes' });
OrdenTrabajo.belongsToMany(Factura, { through: FacturaOrden, foreignKey: 'ordenTrabajoId', otherKey: 'facturaId', as: 'facturas' });
Pago.hasMany(PagoFactura, { foreignKey: 'pagoId', as: 'aplicaciones' });
PagoFactura.belongsTo(Pago, { foreignKey: 'pagoId', as: 'pago' });
PagoFactura.belongsTo(Factura, { foreignKey: 'facturaId', as: 'factura' });
Cotizacion.hasMany(CotizacionDetalle, { foreignKey: 'cotizacionId', as: 'detalles' }); CotizacionDetalle.belongsTo(Servicio, { foreignKey: 'servicioId', as: 'servicio' });
CotizacionDetalle.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });

module.exports = {
  sequelize, Sucursal, Rol, Usuario, UsuarioRol, Cliente, Vehiculo, Servicio, Cita, Cotizacion, CotizacionDetalle,
  OrdenTrabajo, Diagnostico, OrdenServicio, Material, OrdenMaterial, InventarioMovimiento,
  Factura, FacturaOrden, FacturaDetalle, Pago, PagoFactura, Historial,
};
