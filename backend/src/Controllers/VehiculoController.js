class VehiculoController {
    constructor(vehiculoUseCase) {
        this.vehiculoUseCase = vehiculoUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const vehiculos = await this.vehiculoUseCase.obtenerTodos();
            res.status(200).json(vehiculos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const vehiculo = await this.vehiculoUseCase.obtenerPorId(req.params.id);
            res.status(200).json(vehiculo);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const vehiculo = await this.vehiculoUseCase.crear(req.body);
            res.status(201).json(vehiculo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const vehiculo = await this.vehiculoUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(vehiculo);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.vehiculoUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = VehiculoController;