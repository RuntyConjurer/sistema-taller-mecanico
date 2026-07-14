const express = require('express');

const router = express.Router();

module.exports = (pagoController) => {

    router.get('/', pagoController.obtenerTodos.bind(pagoController));

    router.get('/:id', pagoController.obtenerPorId.bind(pagoController));

    router.post('/', pagoController.crear.bind(pagoController));

    router.put('/:id', pagoController.actualizar.bind(pagoController));

    router.get(
        '/factura/:idFactura/saldo',
        pagoController.obtenerSaldoPendiente.bind(pagoController)
    );

    router.delete('/:id', pagoController.eliminar.bind(pagoController));

    return router;
};