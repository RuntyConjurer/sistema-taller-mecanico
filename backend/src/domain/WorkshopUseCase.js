'use strict';

const { STATES } = require('../constants/domainStates');
const { validateRequired, validateState, validatePositive } = require('../validators');
const { AppError } = require('../errors/AppError');

class WorkshopUseCase {
  constructor(repository, resources) {
    this.repository = repository;
    this.resources = resources;
  }

  requestAppointment(input) {
    validateRequired(input, ['cliente', 'vehiculo', 'cita']);
    validateRequired(input.cliente, ['tipoCliente', 'tipoIdentificacion', 'identificacion', 'nombre', 'telefono']);
    validateRequired(input.vehiculo, ['chasis', 'marca', 'modelo', 'anio']);
    validateRequired(input.cita, ['sucursalId', 'fechaCita', 'motivo']);
    if (new Date(input.cita.fechaCita).getTime() <= Date.now()) {
      throw new AppError(422, 'INVALID_APPOINTMENT_DATE', 'La cita debe programarse para una fecha futura.', { fechaCita: 'Selecciona una fecha futura.' });
    }
    return this.repository.createBooking(input);
  }

  updateAppointmentState(id, input, user) {
    validateState(input.estado, STATES.appointment);
    return this.resources.citas.repository.update(id, { estado: input.estado }, { user });
  }

  appointmentToOrder(id, input, user) {
    return this.repository.appointmentToOrder(id, input, user);
  }

  quoteToOrder(id, input, user) {
    return this.repository.quoteToOrder(id, input, user);
  }

  diagnose(id, input, user) {
    validateRequired(input, ['fallaDetectada']);
    for (const field of ['presionBaja', 'presionAlta']) if (input[field] !== undefined && Number(input[field]) < 0) validatePositive(input[field], field);
    return this.repository.upsertDiagnosis(id, input, user);
  }

  consumeMaterial(id, input, user) {
    validateRequired(input, ['materialId', 'cantidad']);
    validatePositive(input.cantidad, 'cantidad');
    return this.repository.addMaterial(id, input, user);
  }

  addService(id, input, user) {
    validateRequired(input, ['servicioId']);
    if (input.cantidad !== undefined) validatePositive(input.cantidad, 'cantidad');
    return this.repository.addService(id, input, user);
  }

  invoice(input, user) {
    validateRequired(input, ['ordenTrabajoId']);
    return this.repository.createInvoice(input, user);
  }

  pay(id, input, user) {
    validateRequired(input, ['monto', 'formaPago']);
    validatePositive(input.monto, 'monto');
    return this.repository.registerPayment(id, input, user);
  }

  close(id, input, user) {
    return this.repository.closeOrder(id, input, user);
  }

  dashboard(user, query) {
    return this.repository.dashboard(user, query);
  }

  incomeReport(query, user) {
    return this.repository.incomeReport(user, query);
  }

  listInvoices(user) {
    return this.repository.listInvoices(user);
  }

  getInvoice(id, user) {
    return this.repository.getInvoice(id, user);
  }
  inventoryMovement(input, user) {
    validateRequired(input, ['materialId', 'tipoMovimiento']);
    if (input.tipoMovimiento === 'AJUSTE') {
      if (!Number.isFinite(Number(input.nuevoStock)) || Number(input.nuevoStock) < 0) {
        throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', { nuevoStock: 'Debe ser cero o mayor.' });
      }
    } else {
      validatePositive(input.cantidad, 'cantidad');
    }
    return this.repository.inventoryMovement(input, user);
  }
  cancelInvoice(id, user) {
    return this.repository.cancelInvoice(id, user);
  }
}

module.exports = { WorkshopUseCase };
