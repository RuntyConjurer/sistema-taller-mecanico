class DiagnosticoUseCase {
    constructor(diagnosticoRepository, ordenTrabajoRepository) {
        this.diagnosticoRepository = diagnosticoRepository;
        this.ordenTrabajoRepository = ordenTrabajoRepository;
    }

    async obtenerTodos() {
        return await this.diagnosticoRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const diagnostico = await this.diagnosticoRepository.obtenerPorId(id);

        if (!diagnostico) {
            throw new Error("Diagnóstico no encontrado.");
        }

        return diagnostico;
    }

    async crear(data) {

        const orden = await this.ordenTrabajoRepository.obtenerPorId(data.id_ot);

        if (!orden) {
            throw new Error("La Orden de Trabajo no existe.");
        }

        return await this.diagnosticoRepository.crear(data);
    }

    async actualizar(id, data) {

        const diagnostico = await this.diagnosticoRepository.obtenerPorId(id);

        if (!diagnostico) {
            throw new Error("Diagnóstico no encontrado.");
        }

        return await this.diagnosticoRepository.actualizar(id, data);
    }

    async eliminar(id) {

        const diagnostico = await this.diagnosticoRepository.obtenerPorId(id);

        if (!diagnostico) {
            throw new Error("Diagnóstico no encontrado.");
        }

        return await this.diagnosticoRepository.eliminar(id);
    }
}

module.exports = DiagnosticoUseCase;