class OrdenTrabajoController {
    constructor(ordenTrabajoUseCase) {
        this.ordenTrabajoUseCase = ordenTrabajoUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const ordenes = await this.ordenTrabajoUseCase.obtenerTodos();
            res.status(200).json(ordenes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const orden = await this.ordenTrabajoUseCase.obtenerPorId(req.params.id);
            res.status(200).json(orden);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const orden = await this.ordenTrabajoUseCase.crear(req.body);
            res.status(201).json(orden);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const orden = await this.ordenTrabajoUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(orden);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async cerrar(req, res) {
        try {
            const orden = await this.ordenTrabajoUseCase.cerrar(req.params.id);
            res.status(200).json(orden);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.ordenTrabajoUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = OrdenTrabajoController;