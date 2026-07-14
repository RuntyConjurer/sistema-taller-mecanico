const Pagos = require('../Pagos');
const { Sequelize } = require('sequelize');

class PagoRepository {
    async obtenerTodos() {
        return await Pagos.findAll();
    }

    async crear(data) {
        return await Pagos.create(data);
    }

    async obtenerPorId(id) {
        return await Pagos.findByPk(id);
    }

    async actualizar(id, data) {
        const pago = await Pagos.findByPk(id);

        if (!pago) return null;

        await pago.update(data);

        return pago;
    }

    async eliminar(id) {
        const pago = await Pagos.findByPk(id);

        if (!pago) return null;

        await pago.destroy();

        return true;
    }
    async obtenerTotalPagado(idFactura) {
    const total = await Pagos.findOne({
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('monto')), 'totalPagado']
        ],
        where: {
            id_factura: idFactura
        },
        raw: true
    });

    return Number(total.totalPagado) || 0;
}
}

module.exports = PagoRepository;