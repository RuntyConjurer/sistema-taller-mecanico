-- =============================================================================
-- Vista: vw_reporte_ingresos_pagos
-- Descripción: Vista financiera para auditoría de caja y reporte de ingresos.
--              Desglosa cada pago recibido, el método utilizado y las
--              facturas que fueron saldadas con dicho pago.
-- Motor: PostgreSQL
-- =============================================================================

CREATE OR REPLACE VIEW vw_reporte_ingresos_pagos AS
SELECT 
    p.id_pago,
    -- Convertimos el timestamp a fecha simple para agrupar reportes diarios
    DATE(p.fecha_pago) AS fecha_corte,
    p.fecha_pago AS fecha_hora_exacta,
    
    p.monto_total AS monto_ingresado,
    p.forma_pago,
    p.referencia,
    
    -- Empleado que recibió el dinero/procesó la transacción
    COALESCE(u.nombre, 'Sistema') AS cajero_responsable,
    
    -- Concatenación de todas las facturas que este pago ayudó a saldar
    (
        SELECT string_agg(f.numero_factura::text, ', ')
        FROM pago_facturas pf
        INNER JOIN facturas f ON pf.id_factura = f.id_factura
        WHERE pf.id_pago = p.id_pago
    ) AS facturas_saldadas

FROM pagos p
LEFT JOIN usuarios u ON p.recibido_por = u.id_usuario
ORDER BY p.fecha_pago DESC;

COMMENT ON VIEW vw_reporte_ingresos_pagos IS 
    'Reporte de ingresos financieros. Detalla los montos recibidos, métodos de pago, referencias bancarias y relaciona las facturas afectadas para facilitar el cuadre de caja diario.';