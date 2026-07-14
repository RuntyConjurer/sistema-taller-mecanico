const express = require('express');

const router = express.Router();

module.exports = (facturaController) => {

    router.get('/', facturaController.obtenerTodos.bind(facturaController));

    router.get('/:id', facturaController.obtenerPorId.bind(facturaController));

    router.post('/', facturaController.crear.bind(facturaController));

    router.put('/:id', facturaController.actualizar.bind(facturaController));

    router.patch(
        '/:id/estado',
        facturaController.cambiarEstado.bind(facturaController)
    );

    router.delete('/:id', facturaController.eliminar.bind(facturaController));

    return router;
};