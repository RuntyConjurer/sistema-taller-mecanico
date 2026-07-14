require('dotenv').config();

const express = require('express');
const cors = require('cors');

const controllers = require('./DI/container');
const authMiddleware = require('./Infrastructure/auth/AuthMiddleware');

const clienteRoutes = require('./Routes/clienteRoutes');
const vehiculoRoutes = require('./Routes/vehiculoRoutes');
const usuarioRoutes = require('./Routes/usuarioRoutes');
const citaRoutes = require('./Routes/citaRoutes');
const diagnosticoRoutes = require('./Routes/diagnosticoRoutes');
const servicioRoutes = require('./Routes/servicioRoutes');
const materialRoutes = require('./Routes/materialRoutes');
const refrigeranteRoutes = require('./Routes/refrigeranteRoutes');
const ordenTrabajoRoutes = require('./Routes/ordenTrabajoRoutes');
const facturaRoutes = require('./Routes/facturaRoutes');
const pagoRoutes = require('./Routes/pagoRoutes');
const reporteRoutes = require('./Routes/reporteRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.json({
        mensaje: 'Backend funcionando'
    });
});

// Rutas públicas
app.use(
    '/usuarios',
    usuarioRoutes(controllers.usuarioController)
);

// Rutas protegidas
app.use(
    '/clientes',
    authMiddleware,
    clienteRoutes(controllers.clienteController)
);

app.use(
    '/vehiculos',
    authMiddleware,
    vehiculoRoutes(controllers.vehiculoController)
);

app.use(
    '/citas',
    authMiddleware,
    citaRoutes(controllers.citaController)
);

app.use(
    '/diagnosticos',
    authMiddleware,
    diagnosticoRoutes(controllers.diagnosticoController)
);

app.use(
    '/servicios',
    authMiddleware,
    servicioRoutes(controllers.servicioController)
);

app.use(
    '/materiales',
    authMiddleware,
    materialRoutes(controllers.materialController)
);

app.use(
    '/refrigerantes',
    authMiddleware,
    refrigeranteRoutes(controllers.refrigeranteController)
);

app.use(
    '/ordenes-trabajo',
    authMiddleware,
    ordenTrabajoRoutes(controllers.ordenTrabajoController)
);

app.use(
    '/facturas',
    authMiddleware,
    facturaRoutes(controllers.facturaController)
);

app.use(
    '/pagos',
    authMiddleware,
    pagoRoutes(controllers.pagoController)
);

app.use(
    '/reportes',
    authMiddleware,
    reporteRoutes(controllers.reporteController)
);

module.exports = app;