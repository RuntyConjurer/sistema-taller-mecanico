'use strict';

const { Op } = require('sequelize');
const models = require('../infrastructure/models');
const { AppError } = require('../errors/AppError');

class AppointmentRepository {
  constructor(db = models) {
    this.db = db;
  }

  async createBooking(payload) {
    const { Cliente, Vehiculo, Cita, Sucursal, Servicio, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const branch = await Sucursal.findOne({ where: { id: payload.cita.sucursalId, activa: true }, transaction });
      if (!branch) throw new AppError(422, 'BRANCH_NOT_AVAILABLE', 'La sucursal seleccionada no está disponible.');

      if (payload.cita.servicioId) {
        const service = await Servicio.findOne({ where: { id: payload.cita.servicioId, activo: true }, transaction });
        if (!service) throw new AppError(422, 'SERVICE_NOT_AVAILABLE', 'El servicio seleccionado no está disponible.');
      }

      const acceptsWhatsApp = payload.cliente.whatsappOptIn === true;
      const clientData = { ...payload.cliente };
      delete clientData.whatsappOptIn;
      let cliente = await Cliente.findOne({
        where: { identificacion: payload.cliente.identificacion },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!cliente) {
        cliente = await Cliente.create({
          ...clientData,
          whatsappOptIn: acceptsWhatsApp,
          whatsappOptInAt: acceptsWhatsApp ? new Date() : null,
          whatsappOptInSource: acceptsWhatsApp ? 'AGENDA_PUBLICA' : null,
        }, { transaction });
      } else if (acceptsWhatsApp && !cliente.whatsappOptIn) {
        if (phoneDigits(cliente.telefono) !== phoneDigits(payload.cliente.telefono)) {
          throw new AppError(
            409,
            'CLIENT_CONTACT_MISMATCH',
            'El teléfono no coincide con el cliente registrado. El personal del taller debe verificar el consentimiento.',
          );
        }
        await cliente.update({
          whatsappOptIn: true,
          whatsappOptInAt: new Date(),
          whatsappOptInSource: 'AGENDA_PUBLICA',
        }, { transaction });
      }

      const identity = [{ chasis: payload.vehiculo.chasis }];
      if (payload.vehiculo.placa) identity.push({ placa: payload.vehiculo.placa });
      let vehiculo = await Vehiculo.findOne({
        where: { [Op.or]: identity },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (vehiculo && Number(vehiculo.clienteId) !== Number(cliente.id)) {
        throw new AppError(409, 'VEHICLE_OWNER_MISMATCH', 'El vehículo ya está registrado a nombre de otro cliente.');
      }
      if (!vehiculo) vehiculo = await Vehiculo.create({ ...payload.vehiculo, clienteId: cliente.id }, { transaction });

      const cita = await Cita.create({
        ...payload.cita,
        clienteId: cliente.id,
        vehiculoId: vehiculo.id,
        estado: 'PROGRAMADA',
      }, { transaction });
      return { cliente, vehiculo, cita };
    });
  }

  async appointmentToOrder(appointmentId, data, user) {
    const { Cita, OrdenTrabajo, sequelize } = this.db;
    return sequelize.transaction(async (transaction) => {
      const cita = await Cita.findByPk(appointmentId, { transaction, lock: transaction.LOCK.UPDATE });
      if (!cita) throw new AppError(404, 'APPOINTMENT_NOT_FOUND', 'No se encontró la cita.');
      if (!user.roles.includes('ADMINISTRADOR') && Number(cita.sucursalId) !== Number(user.sucursalId)) {
        throw new AppError(403, 'BRANCH_FORBIDDEN', 'La cita pertenece a otra sucursal.');
      }
      const existing = await OrdenTrabajo.findOne({ where: { citaId: appointmentId }, transaction });
      if (existing) throw new AppError(409, 'APPOINTMENT_ALREADY_CONVERTED', 'La cita ya tiene una orden de trabajo.');

      const order = await OrdenTrabajo.create({
        vehiculoId: cita.vehiculoId,
        sucursalId: cita.sucursalId,
        citaId: cita.id,
        tecnicoId: data.tecnicoId || null,
        descripcionProblema: cita.motivo,
        observaciones: data.observaciones,
        estado: 'ABIERTA',
      }, { transaction });
      await cita.update({ estado: 'COMPLETADA' }, { transaction });
      return order;
    });
  }
}

function phoneDigits(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return /^(809|829|849)\d{7}$/.test(digits) ? `1${digits}` : digits;
}

module.exports = { AppointmentRepository };
