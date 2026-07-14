const express = require('express');

const router = express.Router();

module.exports = (ordenTrabajoController) => {

    router.get('/', ordenTrabajoController.obtenerTodos.bind(ordenTrabajoController));

    router.get('/:id', ordenTrabajoController.obtenerPorId.bind(ordenTrabajoController));

    router.post('/', ordenTrabajoController.crear.bind(ordenTrabajoController));

    router.put('/:id', ordenTrabajoController.actualizar.bind(ordenTrabajoController));

    router.patch(
        '/:id/cerrar',
        ordenTrabajoController.cerrar.bind(ordenTrabajoController)
    );

    router.delete('/:id', ordenTrabajoController.eliminar.bind(ordenTrabajoController));

    return router;
};