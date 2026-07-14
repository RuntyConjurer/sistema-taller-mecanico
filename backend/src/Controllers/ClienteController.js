class ClienteController {
    constructor(clienteUseCase) {
        this.clienteUseCase = clienteUseCase;
    }

    async obtenerTodos(req, res) {
        try {
            const clientes = await this.clienteUseCase.obtenerTodos();
            res.status(200).json(clientes);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const cliente = await this.clienteUseCase.obtenerPorId(req.params.id);
            res.status(200).json(cliente);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async crear(req, res) {
        try {
            const cliente = await this.clienteUseCase.crear(req.body);
            res.status(201).json(cliente);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const cliente = await this.clienteUseCase.actualizar(
                req.params.id,
                req.body
            );

            res.status(200).json(cliente);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.clienteUseCase.eliminar(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = ClienteController;