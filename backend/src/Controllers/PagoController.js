class PagoController {
    constructor(pagoUseCase) {
        this.pagoUseCase = pagoUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const pagos = await this.pagoUseCase.obtenerTodos();
            res.status(200).json(pagos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const pago = await this.pagoUseCase.obtenerPorId(req.params.id);
            res.status(200).json(pago);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const pago = await this.pagoUseCase.crear(req.body);
            res.status(201).json(pago);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const pago = await this.pagoUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(pago);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async obtenerSaldoPendiente(req, res) {
        try {
            const saldo = await this.pagoUseCase.obtenerSaldoPendiente(
                req.params.idFactura
            );

            res.status(200).json({
                saldoPendiente: saldo
            });

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.pagoUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = PagoController;