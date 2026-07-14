class FacturaController {
    constructor(facturaUseCase) {
        this.facturaUseCase = facturaUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const facturas = await this.facturaUseCase.obtenerTodos();
            res.status(200).json(facturas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const factura = await this.facturaUseCase.obtenerPorId(req.params.id);
            res.status(200).json(factura);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const factura = await this.facturaUseCase.crear(req.body);
            res.status(201).json(factura);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const factura = await this.facturaUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(factura);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async cambiarEstado(req, res) {
        try {
            const factura = await this.facturaUseCase.cambiarEstado(
                req.params.id,
                req.body.estado
            );

            res.status(200).json(factura);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.facturaUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = FacturaController;