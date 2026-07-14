class DiagnosticoController {
    constructor(diagnosticoUseCase) {
        this.diagnosticoUseCase = diagnosticoUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const diagnosticos = await this.diagnosticoUseCase.obtenerTodos();
            res.status(200).json(diagnosticos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const diagnostico = await this.diagnosticoUseCase.obtenerPorId(req.params.id);
            res.status(200).json(diagnostico);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const diagnostico = await this.diagnosticoUseCase.crear(req.body);
            res.status(201).json(diagnostico);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const diagnostico = await this.diagnosticoUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(diagnostico);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.diagnosticoUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = DiagnosticoController;