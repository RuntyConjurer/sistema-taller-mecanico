class CitaUseCase {
    constructor(citaRepository, clienteRepository, vehiculoRepository) {
        this.citaRepository = citaRepository;
        this.clienteRepository = clienteRepository;
        this.vehiculoRepository = vehiculoRepository;
    }

    async obtenerTodos() {
        return await this.citaRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const cita = await this.citaRepository.obtenerPorId(id);

        if (!cita) {
            throw new Error("Cita no encontrada.");
        }

        return cita;
    }

    async crear(data) {

        const cliente = await this.clienteRepository.obtenerPorId(data.id_cliente);

        if (!cliente) {
            throw new Error("Cliente no encontrado.");
        }

        const vehiculo = await this.vehiculoRepository.obtenerPorId(data.id_vehiculo);

        if (!vehiculo) {
            throw new Error("Vehículo no encontrado.");
        }

        return await this.citaRepository.crear(data);
    }

    async actualizar(id, data) {

        const cita = await this.citaRepository.obtenerPorId(id);

        if (!cita) {
            throw new Error("Cita no encontrada.");
        }

        return await this.citaRepository.actualizar(id, data);
    }

    async eliminar(id) {

        const cita = await this.citaRepository.obtenerPorId(id);

        if (!cita) {
            throw new Error("Cita no encontrada.");
        }

        return await this.citaRepository.eliminar(id);
    }
}

module.exports = CitaUseCase;