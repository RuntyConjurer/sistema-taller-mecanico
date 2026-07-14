'use strict';

const { STATES } = require('../constants/domainStates');
const { validateRequired, validateState } = require('../validators');
const { AppError } = require('../errors/AppError');

class AppointmentUseCase {
  constructor(repository, appointmentResourceRepository) {
    this.repository = repository;
    this.appointmentResourceRepository = appointmentResourceRepository;
  }

  request(input) {
    validateRequired(input, ['cliente', 'vehiculo', 'cita']);
    validateRequired(input.cliente, ['tipoCliente', 'tipoIdentificacion', 'identificacion', 'nombre', 'telefono']);
    validateRequired(input.vehiculo, ['chasis', 'marca', 'modelo', 'anio']);
    validateRequired(input.cita, ['sucursalId', 'fechaCita', 'motivo']);
    if (input.cliente.whatsappOptIn !== undefined && typeof input.cliente.whatsappOptIn !== 'boolean') {
      throw new AppError(422, 'VALIDATION_ERROR', 'Revisa los campos indicados.', {
        whatsappOptIn: 'Indica true o false.',
      });
    }
    if (new Date(input.cita.fechaCita).getTime() <= Date.now()) {
      throw new AppError(422, 'INVALID_APPOINTMENT_DATE', 'La cita debe programarse para una fecha futura.', {
        fechaCita: 'Selecciona una fecha futura.',
      });
    }
    return this.repository.createBooking(input);
  }

  updateState(id, input, user) {
    validateState(input.estado, STATES.appointment);
    return this.appointmentResourceRepository.update(id, { estado: input.estado }, { user });
  }

  convertToOrder(id, input, user) {
    return this.repository.appointmentToOrder(id, input, user);
  }
}

module.exports = { AppointmentUseCase };
