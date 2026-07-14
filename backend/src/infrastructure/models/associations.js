'use strict';

function associateModels(models) {
  const {
    Cliente, Vehiculo, Cita, Sucursal, Servicio, Usuario, Rol, UsuarioRol,
    OrdenTrabajo, Diagnostico, OrdenServicio, OrdenMaterial, Material,
    Factura, FacturaDetalle, PagoFactura, FacturaOrden, Pago,
    Cotizacion, CotizacionDetalle, WhatsAppMessage,
  } = models;

  Cliente.hasMany(Vehiculo, { foreignKey: 'clienteId', as: 'vehiculos' });
  Vehiculo.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
  Cliente.hasMany(Cita, { foreignKey: 'clienteId', as: 'citas' });
  Cita.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
  Vehiculo.hasMany(Cita, { foreignKey: 'vehiculoId', as: 'citas' });
  Cita.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });
  Sucursal.hasMany(Cita, { foreignKey: 'sucursalId', as: 'citas' });
  Cita.belongsTo(Sucursal, { foreignKey: 'sucursalId', as: 'sucursal' });
  Cita.belongsTo(Servicio, { foreignKey: 'servicioId', as: 'servicio' });
  Usuario.belongsToMany(Rol, { through: UsuarioRol, foreignKey: 'usuarioId', otherKey: 'rolId', as: 'roles' });
  OrdenTrabajo.belongsTo(Vehiculo, { foreignKey: 'vehiculoId', as: 'vehiculo' });
  OrdenTrabajo.belongsTo(Cita, { foreignKey: 'citaId', as: 'cita' });
  OrdenTrabajo.belongsTo(Usuario, { foreignKey: 'tecnicoId', as: 'tecnico' });
  OrdenTrabajo.hasOne(Diagnostico, { foreignKey: 'ordenTrabajoId', as: 'diagnostico' });
  OrdenTrabajo.hasMany(OrdenServicio, { foreignKey: 'ordenTrabajoId', as: 'servicios' });
  OrdenServicio.belongsTo(Servicio, { foreignKey: 'servicioId', as: 'servicio' });
  OrdenTrabajo.hasMany(OrdenMaterial, { foreignKey: 'ordenTrabajoId', as: 'materiales' });
  OrdenMaterial.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });
  Factura.hasMany(FacturaDetalle, { foreignKey: 'facturaId', as: 'detalles' });
  Factura.hasMany(PagoFactura, { foreignKey: 'facturaId', as: 'aplicacionesPago' });
  Factura.belongsToMany(OrdenTrabajo, { through: FacturaOrden, foreignKey: 'facturaId', otherKey: 'ordenTrabajoId', as: 'ordenes' });
  OrdenTrabajo.belongsToMany(Factura, { through: FacturaOrden, foreignKey: 'ordenTrabajoId', otherKey: 'facturaId', as: 'facturas' });
  Pago.hasMany(PagoFactura, { foreignKey: 'pagoId', as: 'aplicaciones' });
  PagoFactura.belongsTo(Pago, { foreignKey: 'pagoId', as: 'pago' });
  PagoFactura.belongsTo(Factura, { foreignKey: 'facturaId', as: 'factura' });
  Cotizacion.hasMany(CotizacionDetalle, { foreignKey: 'cotizacionId', as: 'detalles' });
  CotizacionDetalle.belongsTo(Servicio, { foreignKey: 'servicioId', as: 'servicio' });
  CotizacionDetalle.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });
  Cliente.hasMany(WhatsAppMessage, { foreignKey: 'clienteId', as: 'mensajesWhatsApp' });
  WhatsAppMessage.belongsTo(Cliente, { foreignKey: 'clienteId', as: 'cliente' });
  Cita.hasMany(WhatsAppMessage, { foreignKey: 'citaId', as: 'mensajesWhatsApp' });
  WhatsAppMessage.belongsTo(Cita, { foreignKey: 'citaId', as: 'cita' });
  Usuario.hasMany(WhatsAppMessage, { foreignKey: 'usuarioId', as: 'mensajesWhatsApp' });
  WhatsAppMessage.belongsTo(Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
}

module.exports = { associateModels };
