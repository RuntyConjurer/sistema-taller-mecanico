class PagoUseCase {
    constructor(pagoRepository, facturaRepository) {
        this.pagoRepository = pagoRepository;
        this.facturaRepository = facturaRepository;
    }

    async obtenerTodos() {
        return await this.pagoRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const pago = await this.pagoRepository.obtenerPorId(id);

        if (!pago) {
            throw new Error("Pago no encontrado.");
        }

        return pago;
    }

    async crear(data) {
        const factura = await this.facturaRepository.obtenerPorId(data.id_factura);

        if (!factura) {
            throw new Error("La factura no existe.");
        }

        return await this.pagoRepository.crear(data);
    }

    async actualizar(id, data) {
        const pago = await this.pagoRepository.obtenerPorId(id);

        if (!pago) {
            throw new Error("Pago no encontrado.");
        }

        return await this.pagoRepository.actualizar(id, data);
    }

    async eliminar(id) {
        const pago = await this.pagoRepository.obtenerPorId(id);

        if (!pago) {
            throw new Error("Pago no encontrado.");
        }

        return await this.pagoRepository.eliminar(id);
    }

    async obtenerSaldoPendiente(idFactura) {
        const factura = await this.facturaRepository.obtenerPorId(idFactura);

        if (!factura) {
            throw new Error("Factura no encontrada.");
        }

        const totalPagado = await this.pagoRepository.obtenerTotalPagado(idFactura);

        return factura.total - totalPagado;
    }

    async validarPagosPendientes(idFactura) {
        const saldoPendiente = await this.obtenerSaldoPendiente(idFactura);

        return saldoPendiente <= 0;
    }
}

module.exports = PagoUseCase;