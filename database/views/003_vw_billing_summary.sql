-- =========================================================
-- Vista para resumen de facturas
-- =========================================================
DROP VIEW IF EXISTS vw_facturas_resumen;

CREATE OR REPLACE VIEW vw_facturas_resumen AS
SELECT
    f.id_factura,
    f.numero_factura,
    f.fecha,
    f.estado,
    f.subtotal,
    f.impuesto,
    f.descuento,
    f.total,
    f.observaciones,

    ot.id_ot,
    ot.estado AS estado_ot,
    ot.fecha_apertura,
    ot.fecha_cierre,

    c.id_cliente,
    c.nombre AS nombre_cliente,
    c.identificacion AS identificacion_cliente,
    c.telefono AS telefono_cliente,
    c.email AS email_cliente,

    COALESCE(pag.total_pagado, 0) AS total_pagado,
    (f.total - COALESCE(pag.total_pagado, 0)) AS saldo_pendiente

FROM facturas f
INNER JOIN ordenes_trabajo ot
    ON ot.id_ot = f.id_ot
INNER JOIN vehiculos v
    ON v.id_vehiculo = ot.id_vehiculo
INNER JOIN clientes c
    ON c.id_cliente = v.id_cliente

LEFT JOIN (
    SELECT
        p.id_factura,
        SUM(p.monto) AS total_pagado
    FROM pagos p
    GROUP BY p.id_factura
) pag
    ON pag.id_factura = f.id_factura;