class CitaController {
    constructor(citaUseCase) {
        this.citaUseCase = citaUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const citas = await this.citaUseCase.obtenerTodos();
            res.status(200).json(citas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const cita = await this.citaUseCase.obtenerPorId(req.params.id);
            res.status(200).json(cita);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const cita = await this.citaUseCase.crear(req.body);
            res.status(201).json(cita);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const cita = await this.citaUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(cita);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.citaUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = CitaController;