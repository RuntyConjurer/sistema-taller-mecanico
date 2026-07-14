const InventarioMovimientos = require('../InventarioMovimientos');

class InventarioMovimientoRepository {
    async obtenerTodos() {
        return await InventarioMovimientos.findAll();
    }

    async crear(data) {
        return await InventarioMovimientos.create(data);
    }

    async obtenerPorId(id) {
        return await InventarioMovimientos.findByPk(id);
    }

    async actualizar(id, data) {
        const movimiento = await InventarioMovimientos.findByPk(id);

        if (!movimiento) return null;

        await movimiento.update(data);

        return movimiento;
    }

    async eliminar(id) {
        const movimiento = await InventarioMovimientos.findByPk(id);

        if (!movimiento) return null;

        await movimiento.destroy();

        return true;
    }
}

module.exports = InventarioMovimientoRepository;