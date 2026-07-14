class RefrigeranteUseCase {

    constructor(
        refrigeranteRepository,
        inventarioMovimientoRepository
    ) {
        this.refrigeranteRepository = refrigeranteRepository;
        this.inventarioMovimientoRepository = inventarioMovimientoRepository;
    }


    async obtenerTodos() {
        return await this.refrigeranteRepository.obtenerTodos();
    }


    async obtenerPorId(id) {

        const refrigerante =
            await this.refrigeranteRepository.obtenerPorId(id);


        if (!refrigerante) {
            throw new Error("Refrigerante no encontrado.");
        }


        return refrigerante;
    }


    async crear(data) {

        return await this.refrigeranteRepository.crear(data);

    }


    async actualizar(id, data) {

        const refrigerante =
            await this.refrigeranteRepository.obtenerPorId(id);


        if (!refrigerante) {
            throw new Error("Refrigerante no encontrado.");
        }


        return await this.refrigeranteRepository.actualizar(id, data);

    }


    async eliminar(id) {

        const refrigerante =
            await this.refrigeranteRepository.obtenerPorId(id);


        if (!refrigerante) {
            throw new Error("Refrigerante no encontrado.");
        }


        return await this.refrigeranteRepository.eliminar(id);

    }


    async registrarConsumo(
        idRefrigerante,
        cantidad,
        idUsuario,
        idOT
    ) {


        const refrigerante =
            await this.refrigeranteRepository.obtenerPorId(idRefrigerante);


        if (!refrigerante) {
            throw new Error("Refrigerante no encontrado.");
        }


        const stockActual =
            Number(refrigerante.stock_actual);


        if (stockActual < cantidad) {
            throw new Error(
                "Stock insuficiente de refrigerante."
            );
        }


        const nuevoStock =
            stockActual - cantidad;



        await this.refrigeranteRepository.actualizar(
            idRefrigerante,
            {
                stock_actual: nuevoStock
            }
        );



        await this.inventarioMovimientoRepository.crear({
            id_refrigerante: idRefrigerante,
            id_usuario: idUsuario,
            id_ot: idOT,
            tipo_movimiento: "SALIDA",
            cantidad: cantidad,
            motivo: "Consumo de refrigerante en orden de trabajo"
        });



        return {
            mensaje: "Consumo registrado correctamente.",
            stock_actual: nuevoStock
        };

    }

}


module.exports = RefrigeranteUseCase;