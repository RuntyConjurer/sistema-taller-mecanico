const Sucursales = require('../Sucursales');

class SucursalRepository {
    async obtenerTodos() {
        return await Sucursales.findAll();
    }

    async crear(data) {
        return await Sucursales.create(data);
    }

    async obtenerPorId(id) {
        return await Sucursales.findByPk(id);
    }

    async actualizar(id, data) {
        const sucursal = await Sucursales.findByPk(id);

        if (!sucursal) return null;

        await sucursal.update(data);

        return sucursal;
    }

    async eliminar(id) {
        const sucursal = await Sucursales.findByPk(id);

        if (!sucursal) return null;

        await sucursal.destroy();

        return true;
    }
}

module.exports = SucursalRepository;