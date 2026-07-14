class ServicioController {
    constructor(servicioUseCase) {
        this.servicioUseCase = servicioUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const servicios = await this.servicioUseCase.obtenerTodos();
            res.status(200).json(servicios);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const servicio = await this.servicioUseCase.obtenerPorId(req.params.id);
            res.status(200).json(servicio);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const servicio = await this.servicioUseCase.crear(req.body);
            res.status(201).json(servicio);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const servicio = await this.servicioUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(servicio);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.servicioUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = ServicioController;