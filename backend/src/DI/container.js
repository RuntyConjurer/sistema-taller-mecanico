const ClienteRepository = require('../Infrastructure/Repositories/ClienteRepository');
const VehiculoRepository = require('../Infrastructure/Repositories/VehiculoRepository');
const UsuarioRepository = require('../Infrastructure/Repositories/UsuarioRepository');
const CitaRepository = require('../Infrastructure/Repositories/CitaRepository');
const DiagnosticoRepository = require('../Infrastructure/Repositories/DiagnosticoRepository');
const InventarioMovimientoRepository = require('../Infrastructure/Repositories/InventarioMovimientoRepository');

const ServicioRepository = require('../Infrastructure/Repositories/ServicioRepository');
const MaterialRepository = require('../Infrastructure/Repositories/MaterialRepository');
const RefrigeranteRepository = require('../Infrastructure/Repositories/RefrigeranteRepository');
const OrdenTrabajoRepository = require('../Infrastructure/Repositories/OrdenTrabajoRepository');
const FacturaRepository = require('../Infrastructure/Repositories/FacturaRepository');
const PagoRepository = require('../Infrastructure/Repositories/PagoRepository');
const ReporteRepository = require('../Infrastructure/Repositories/ReporteRepository');



const ClienteUseCase = require('../Domain/ClienteUseCase');
const VehiculoUseCase = require('../Domain/VehiculoUseCase');
const UsuarioUseCase = require('../Domain/UsuarioUseCase');
const CitaUseCase = require('../Domain/CitaUseCase');
const DiagnosticoUseCase = require('../Domain/DiagnosticoUseCase');

const ServicioUseCase = require('../Domain/ServicioUseCase');
const MaterialUseCase = require('../Domain/MaterialUseCase');
const RefrigeranteUseCase = require('../Domain/RefrigeranteUseCase');
const OrdenTrabajoUseCase = require('../Domain/OrdenTrabajoUseCase');
const FacturaUseCase = require('../Domain/FacturaUseCase');
const PagoUseCase = require('../Domain/PagoUseCase');
const ReporteUseCase = require('../Domain/ReporteUseCase');




const ClienteController = require('../Controllers/ClienteController');
const VehiculoController = require('../Controllers/VehiculoController');
const UsuarioController = require('../Controllers/UsuarioController');
const CitaController = require('../Controllers/CitaController');
const DiagnosticoController = require('../Controllers/DiagnosticoController');

const ServicioController = require('../Controllers/ServicioController');
const MaterialController = require('../Controllers/MaterialController');
const RefrigeranteController = require('../Controllers/RefrigeranteController');
const OrdenTrabajoController = require('../Controllers/OrdenTrabajoController');
const FacturaController = require('../Controllers/FacturaController');
const PagoController = require('../Controllers/PagoController');
const ReporteController = require('../Controllers/ReporteController');

//repositorios Instancias
// Repositories

const clienteRepository = new ClienteRepository();
const vehiculoRepository = new VehiculoRepository();
const usuarioRepository = new UsuarioRepository();
const citaRepository = new CitaRepository();
const diagnosticoRepository = new DiagnosticoRepository();

const servicioRepository = new ServicioRepository();
const materialRepository = new MaterialRepository();
const refrigeranteRepository = new RefrigeranteRepository();
const ordenTrabajoRepository = new OrdenTrabajoRepository();
const facturaRepository = new FacturaRepository();
const pagoRepository = new PagoRepository();
const reporteRepository = new ReporteRepository();
const inventarioMovimientoRepository = new InventarioMovimientoRepository();

//usecases
const clienteUseCase =
    new ClienteUseCase(clienteRepository);



const vehiculoUseCase =
    new VehiculoUseCase(vehiculoRepository);

const usuarioUseCase =
    new UsuarioUseCase(usuarioRepository);

const citaUseCase =
    new CitaUseCase(citaRepository);

const diagnosticoUseCase =
    new DiagnosticoUseCase(diagnosticoRepository);


const servicioUseCase =
    new ServicioUseCase(servicioRepository);

const materialUseCase =
    new MaterialUseCase(materialRepository);

const refrigeranteUseCase = new RefrigeranteUseCase(
    refrigeranteRepository,
    inventarioMovimientoRepository
);




const ordenTrabajoUseCase = new OrdenTrabajoUseCase(
    ordenTrabajoRepository,
    diagnosticoRepository,
    facturaRepository,
    refrigeranteUseCase
);

const facturaUseCase =
    new FacturaUseCase(
        facturaRepository
    );

const pagoUseCase =
    new PagoUseCase(
        pagoRepository,
        facturaRepository
    );

const reporteUseCase =
    new ReporteUseCase(
        reporteRepository
    );

    //controllers
    module.exports = {

    clienteController:
        new ClienteController(clienteUseCase),

    vehiculoController:
        new VehiculoController(vehiculoUseCase),

    usuarioController:
        new UsuarioController(usuarioUseCase),

    citaController:
        new CitaController(citaUseCase),

    diagnosticoController:
        new DiagnosticoController(diagnosticoUseCase),


    servicioController:
        new ServicioController(servicioUseCase),

    materialController:
        new MaterialController(materialUseCase),

    refrigeranteController:
        new RefrigeranteController(refrigeranteUseCase),

    ordenTrabajoController:
        new OrdenTrabajoController(ordenTrabajoUseCase),

    facturaController:
        new FacturaController(facturaUseCase),

    pagoController:
        new PagoController(pagoUseCase),

    reporteController:
        new ReporteController(reporteUseCase)
};