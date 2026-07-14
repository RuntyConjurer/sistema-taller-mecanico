'use strict';

const { sequelize } = require('../database');
const { defineCatalogModels } = require('./catalogModels');
const { defineIdentityModels } = require('./identityModels');
const { defineAppointmentModels } = require('./appointmentModels');
const { defineQuoteModels } = require('./quoteModels');
const { defineWorkOrderModels } = require('./workOrderModels');
const { defineInventoryModels } = require('./inventoryModels');
const { defineBillingModels } = require('./billingModels');
const { defineWhatsAppModels } = require('./whatsappModels');
const { associateModels } = require('./associations');

const models = {
  ...defineCatalogModels(sequelize),
  ...defineIdentityModels(sequelize),
  ...defineAppointmentModels(sequelize),
  ...defineQuoteModels(sequelize),
  ...defineWorkOrderModels(sequelize),
  ...defineInventoryModels(sequelize),
  ...defineBillingModels(sequelize),
  ...defineWhatsAppModels(sequelize),
};

associateModels(models);

const {
  Sucursal, Rol, Usuario, UsuarioRol, Cliente, Vehiculo, Servicio, Cita, Cotizacion, CotizacionDetalle,
  OrdenTrabajo, Diagnostico, OrdenServicio, Material, OrdenMaterial, InventarioMovimiento,
  Factura, FacturaOrden, FacturaDetalle, Pago, PagoFactura, Historial, WhatsAppMessage,
} = models;

module.exports = {
  sequelize, Sucursal, Rol, Usuario, UsuarioRol, Cliente, Vehiculo, Servicio, Cita, Cotizacion, CotizacionDetalle,
  OrdenTrabajo, Diagnostico, OrdenServicio, Material, OrdenMaterial, InventarioMovimiento,
  Factura, FacturaOrden, FacturaDetalle, Pago, PagoFactura, Historial, WhatsAppMessage,
};
