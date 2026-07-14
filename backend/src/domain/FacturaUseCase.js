class FacturaUseCase {
    constructor(facturaRepository, ordenTrabajoRepository) {
        this.facturaRepository = facturaRepository;
        this.ordenTrabajoRepository = ordenTrabajoRepository;
    }

    async obtenerTodos() {
        return await this.facturaRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        return await this.facturaRepository.obtenerPorId(id);
    }

    async crear(data) {

        const orden = await this.ordenTrabajoRepository.obtenerPorId(data.id_ot);

        if (!orden) {
            throw new Error("La Orden de Trabajo no existe.");
        }

        return await this.facturaRepository.crear(data);
    }

    async actualizar(id, data) {
        return await this.facturaRepository.actualizar(id, data);
    }

    async eliminar(id) {
        return await this.facturaRepository.eliminar(id);
    }
}

module.exports = FacturaUseCase;