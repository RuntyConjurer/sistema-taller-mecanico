class ReporteController {
    constructor(reporteUseCase) {
        this.reporteUseCase = reporteUseCase;
    }

    async facturacion(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;

            const reporte = await this.reporteUseCase.obtenerReporteFacturacion(
                fechaInicio,
                fechaFin
            );

            res.status(200).json(reporte);

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


    async ordenesTrabajo(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;

            const reporte = await this.reporteUseCase.obtenerReporteOrdenesTrabajo(
                fechaInicio,
                fechaFin
            );

            res.status(200).json(reporte);

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }


    async inventario(req, res) {
        try {
            const reporte = await this.reporteUseCase.obtenerReporteInventario();

            res.status(200).json(reporte);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    async stockBajo(req, res) {
        try {
            const reporte = await this.reporteUseCase.obtenerReporteStockBajo();

            res.status(200).json(reporte);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    async clientes(req, res) {
        try {
            const reporte = await this.reporteUseCase.obtenerReporteClientes();

            res.status(200).json(reporte);

        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = ReporteController;