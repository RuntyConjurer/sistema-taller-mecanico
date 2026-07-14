class OrdenTrabajoUseCase {

    constructor(
        ordenTrabajoRepository,
        diagnosticoRepository,
        facturaRepository,
        refrigeranteUseCase
    ) {
        this.ordenTrabajoRepository = ordenTrabajoRepository;
        this.diagnosticoRepository = diagnosticoRepository;
        this.facturaRepository = facturaRepository;
        this.refrigeranteUseCase = refrigeranteUseCase;
    }


    async obtenerTodos() {
        return await this.ordenTrabajoRepository.obtenerTodos();
    }


    async obtenerPorId(id) {

        const orden =
            await this.ordenTrabajoRepository.obtenerPorId(id);

        if (!orden) {
            throw new Error("Orden de trabajo no encontrada.");
        }

        return orden;
    }


    async crear(data) {
        return await this.ordenTrabajoRepository.crear(data);
    }


    async actualizar(id, data) {

        const orden =
            await this.ordenTrabajoRepository.obtenerPorId(id);

        if (!orden) {
            throw new Error("Orden de trabajo no encontrada.");
        }

        return await this.ordenTrabajoRepository.actualizar(id, data);
    }


    async eliminar(id) {

        const orden =
            await this.ordenTrabajoRepository.obtenerPorId(id);

        if (!orden) {
            throw new Error("Orden de trabajo no encontrada.");
        }

        return await this.ordenTrabajoRepository.eliminar(id);
    }


    async cerrarOrden(id) {

        const orden =
            await this.ordenTrabajoRepository.obtenerPorId(id);

        if (!orden) {
            throw new Error("Orden de trabajo no encontrada.");
        }


        const diagnostico =
            await this.diagnosticoRepository.obtenerPorOrdenTrabajo(id);


        if (!diagnostico) {
            throw new Error(
                "No se puede cerrar una OT sin diagnóstico."
            );
        }


        const factura =
            await this.facturaRepository.obtenerPorOrdenTrabajo(id);


        if (!factura) {
            throw new Error(
                "No se puede cerrar una OT sin factura."
            );
        }


        return await this.ordenTrabajoRepository.actualizar(id, {
            estado: "CERRADA",
            fecha_cierre: new Date()
        });
    }


    async registrarConsumoRefrigerante(idOT, data) {

        const orden =
            await this.ordenTrabajoRepository.obtenerPorId(idOT);


        if (!orden) {
            throw new Error("Orden de trabajo no encontrada.");
        }


        return await this.refrigeranteUseCase.registrarConsumo(
            data.id_refrigerante,
            data.cantidad,
            data.id_usuario,
            idOT
        );
    }

}


module.exports = OrdenTrabajoUseCase;