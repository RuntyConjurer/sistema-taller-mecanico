const express = require('express');

const router = express.Router();

module.exports = (reporteController) => {

    router.get(
        '/facturacion',
        reporteController.facturacion.bind(reporteController)
    );

    router.get(
        '/ordenes-trabajo',
        reporteController.ordenesTrabajo.bind(reporteController)
    );

    router.get(
        '/inventario',
        reporteController.inventario.bind(reporteController)
    );

    router.get(
        '/stock-bajo',
        reporteController.stockBajo.bind(reporteController)
    );

    router.get(
        '/clientes',
        reporteController.clientes.bind(reporteController)
    );

    return router;
};