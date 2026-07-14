'use strict';

const { BaseRepository } = require('../repositories/BaseRepository');
const { ResourceUseCase } = require('../domain/ResourceUseCase');
const { createResourceController } = require('../controllers/createResourceController');
const { STATES } = require('../constants/domainStates');

function resource(model, config = {}, repoOptions = {}) {
  const repository = new BaseRepository(model, repoOptions);
  const useCase = new ResourceUseCase(repository, config);
  return { repository, useCase, controller: createResourceController(useCase) };
}

function createResources(models) {
  return {
    sucursales: resource(models.Sucursal, {
      fields: ['nombre', 'direccion', 'telefono', 'email', 'activa'],
      required: ['nombre', 'direccion'],
    }),
    clientes: resource(models.Cliente, {
      fields: ['tipoCliente', 'tipoIdentificacion', 'identificacion', 'nombre', 'telefono', 'direccion', 'email', 'activo'],
      required: ['tipoCliente', 'tipoIdentificacion', 'identificacion', 'nombre'],
    }, { include: [{ model: models.Vehiculo, as: 'vehiculos' }] }),
    vehiculos: resource(models.Vehiculo, {
      fields: ['clienteId', 'chasis', 'marca', 'modelo', 'placa', 'color', 'anio', 'tipoRefrigerante', 'activo'],
      required: ['clienteId', 'chasis', 'marca', 'modelo'],
    }, { include: [{ model: models.Cliente, as: 'cliente' }] }),
    servicios: resource(models.Servicio, {
      fields: ['nombre', 'descripcion', 'precioBase', 'porcentajeImpuesto', 'activo'],
      required: ['nombre', 'precioBase'],
    }),
    citas: resource(models.Cita, {
      fields: ['clienteId', 'vehiculoId', 'sucursalId', 'servicioId', 'fechaCita', 'motivo', 'observaciones'],
      required: ['clienteId', 'vehiculoId', 'fechaCita'],
      states: STATES.appointment,
      branchScoped: true,
    }, {
      branchScoped: true,
      include: [
        { model: models.Cliente, as: 'cliente' },
        { model: models.Vehiculo, as: 'vehiculo' },
        { model: models.Servicio, as: 'servicio' },
        { model: models.Sucursal, as: 'sucursal' },
      ],
    }),
    ordenes: resource(models.OrdenTrabajo, {
      fields: ['vehiculoId', 'tecnicoId', 'sucursalId', 'descripcionProblema', 'observaciones'],
      required: ['vehiculoId'],
      states: ['ABIERTA', 'EN_DIAGNOSTICO', 'EN_REPARACION', 'CANCELADA'],
      branchScoped: true,
    }, {
      branchScoped: true,
      include: [
        { model: models.Vehiculo, as: 'vehiculo', include: [{ model: models.Cliente, as: 'cliente' }] },
        { model: models.Usuario, as: 'tecnico', attributes: ['id', 'nombre'] },
        { model: models.Diagnostico, as: 'diagnostico' },
        { model: models.OrdenServicio, as: 'servicios', include: [{ model: models.Servicio, as: 'servicio' }] },
        { model: models.OrdenMaterial, as: 'materiales', include: [{ model: models.Material, as: 'material' }] },
        { model: models.Factura, as: 'facturas', through: { attributes: [] } },
      ],
    }),
    materiales: resource(models.Material, {
      fields: ['nombre', 'descripcion', 'categoria', 'unidadMedida', 'stockActual', 'stockMinimo', 'costoUnitario', 'precioVenta', 'activo'],
      required: ['nombre', 'categoria', 'unidadMedida'],
    }),
    movimientos: resource(models.InventarioMovimiento, {
      fields: ['materialId', 'tipoMovimiento', 'cantidad', 'costoUnitario', 'motivo', 'usuarioId'],
      required: ['materialId', 'tipoMovimiento', 'cantidad'],
    }),
    facturas: resource(models.Factura, {
      fields: ['estado', 'observaciones'],
      states: STATES.invoice,
    }, {
      include: [
        { model: models.FacturaDetalle, as: 'detalles' },
        { model: models.PagoFactura, as: 'aplicacionesPago' },
      ],
    }),
    pagos: resource(models.Pago, {}, {
      include: [{
        model: models.PagoFactura,
        as: 'aplicaciones',
        include: [{ model: models.Factura, as: 'factura' }],
      }],
    }),
    historial: resource(models.Historial),
  };
}

module.exports = { createResources };
