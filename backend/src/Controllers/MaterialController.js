class MaterialController {
    constructor(materialUseCase) {
        this.materialUseCase = materialUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const materiales = await this.materialUseCase.obtenerTodos();
            res.status(200).json(materiales);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const material = await this.materialUseCase.obtenerPorId(req.params.id);
            res.status(200).json(material);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const material = await this.materialUseCase.crear(req.body);
            res.status(201).json(material);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const material = await this.materialUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(material);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.materialUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = MaterialController;