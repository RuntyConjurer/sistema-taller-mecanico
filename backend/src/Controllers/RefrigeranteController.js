class RefrigeranteController {
    constructor(refrigeranteUseCase) {
        this.refrigeranteUseCase = refrigeranteUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const refrigerantes = await this.refrigeranteUseCase.obtenerTodos();
            res.status(200).json(refrigerantes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const refrigerante = await this.refrigeranteUseCase.obtenerPorId(req.params.id);
            res.status(200).json(refrigerante);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const refrigerante = await this.refrigeranteUseCase.crear(req.body);
            res.status(201).json(refrigerante);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const refrigerante = await this.refrigeranteUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(refrigerante);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.refrigeranteUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = RefrigeranteController;