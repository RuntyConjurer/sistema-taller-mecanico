const Clientes = require('../Clientes');

class ClienteRepository {
    async obtenerTodos() {
        return await Clientes.findAll();
    }

    async obtenerPorId(id) {
        return await Clientes.findByPk(id);
    }

    async crear(data) {
        return await Clientes.create(data);
    }

    async actualizar(id, data) {
        const cliente = await Clientes.findByPk(id);

        if (!cliente) return null;

        await cliente.update(data);

        return cliente;
    }

    async eliminar(id) {
        const cliente = await Clientes.findByPk(id);

        if (!cliente) return null;

        await cliente.destroy();

        return true;
    }
}

module.exports = ClienteRepository;