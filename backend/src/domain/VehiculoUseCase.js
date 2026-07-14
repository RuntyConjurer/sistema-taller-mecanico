class VehiculoUseCase {
    constructor(vehiculoRepository, clienteRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.clienteRepository = clienteRepository;
    }

    async obtenerTodos() {
        return await this.vehiculoRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const vehiculo = await this.vehiculoRepository.obtenerPorId(id);

        if (!vehiculo) {
            throw new Error("Vehículo no encontrado.");
        }

        return vehiculo;
    }

    async crear(data) {
        const cliente = await this.clienteRepository.obtenerPorId(data.id_cliente);

        if (!cliente) {
            throw new Error("El cliente no existe.");
        }

        return await this.vehiculoRepository.crear(data);
    }

    async actualizar(id, data) {
        const vehiculo = await this.vehiculoRepository.obtenerPorId(id);

        if (!vehiculo) {
            throw new Error("Vehículo no encontrado.");
        }

        return await this.vehiculoRepository.actualizar(id, data);
    }

    async eliminar(id) {
        const vehiculo = await this.vehiculoRepository.obtenerPorId(id);

        if (!vehiculo) {
            throw new Error("Vehículo no encontrado.");
        }

        return await this.vehiculoRepository.eliminar(id);
    }
}

module.exports = VehiculoUseCase;