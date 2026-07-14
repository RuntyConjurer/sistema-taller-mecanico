class ServicioUseCase {
    constructor(servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    async obtenerTodos() {
        return await this.servicioRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const servicio = await this.servicioRepository.obtenerPorId(id);

        if (!servicio) {
            throw new Error("Servicio no encontrado.");
        }

        return servicio;
    }

    async crear(data) {
        return await this.servicioRepository.crear(data);
    }

    async actualizar(id, data) {
        const servicio = await this.servicioRepository.obtenerPorId(id);

        if (!servicio) {
            throw new Error("Servicio no encontrado.");
        }

        return await this.servicioRepository.actualizar(id, data);
    }

    async eliminar(id) {
        const servicio = await this.servicioRepository.obtenerPorId(id);

        if (!servicio) {
            throw new Error("Servicio no encontrado.");
        }

        return await this.servicioRepository.eliminar(id);
    }
}

module.exports = ServicioUseCase;