const FacturaDetalles = require('../FacturaDetalles');

class FacturaDetalleRepository {
    async obtenerTodos() {
        return await FacturaDetalles.findAll();
    }

    async obtenerPorId(id) {
        return await FacturaDetalles.findByPk(id);
    }

    async crear(data) {
        return await FacturaDetalles.create(data);
    }

    async actualizar(id, data) {
        const detalle = await FacturaDetalles.findByPk(id);

        if (!detalle) return null;

        await detalle.update(data);

        return detalle;
    }

    async eliminar(id) {
        const detalle = await FacturaDetalles.findByPk(id);

        if (!detalle) return null;

        await detalle.destroy();

        return true;
    }
}

module.exports = FacturaDetalleRepository;