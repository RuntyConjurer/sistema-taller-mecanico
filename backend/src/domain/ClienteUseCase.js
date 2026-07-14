class ClienteUseCase {
    constructor(clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    async obtenerTodos() {
        return await this.clienteRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const cliente = await this.clienteRepository.obtenerPorId(id);

        if (!cliente) {
            throw new Error("Cliente no encontrado.");
        }

        return cliente;
    }

    async crear(data) {
        return await this.clienteRepository.crear(data);
    }

    async actualizar(id, data) {
        const cliente = await this.clienteRepository.obtenerPorId(id);

        if (!cliente) {
            throw new Error("Cliente no encontrado.");
        }

        return await this.clienteRepository.actualizar(id, data);
    }

    async eliminar(id) {
        const cliente = await this.clienteRepository.obtenerPorId(id);

        if (!cliente) {
            throw new Error("Cliente no encontrado.");
        }

        return await this.clienteRepository.eliminar(id);
    }
}

module.exports = ClienteUseCase;