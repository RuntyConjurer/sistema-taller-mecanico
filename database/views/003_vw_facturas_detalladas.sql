-- =============================================================================
-- Vista: vw_facturas_detalladas
-- Descripción: Vista consolidada de facturas. Agrupa los datos del cliente,
--              las órdenes de trabajo vinculadas y los detalles de cobro.
-- Motor: PostgreSQL
-- =============================================================================

CREATE OR REPLACE VIEW vw_facturas_detalladas AS
SELECT 
    f.id_factura,
    f.numero_factura,
    f.fecha AS fecha_emision,
    f.estado AS estado_factura,
    f.subtotal,
    f.impuesto,
    f.total,
    
    -- Datos del Cliente (obtenidos a través de la primera OT vinculada)
    c.id_cliente,
    c.nombre AS cliente_nombre,
    c.identificacion AS cliente_id,
    
    -- Agrupación de OTs (para saber qué estamos facturando)
    (
        SELECT string_agg(ot.id_ot::text, ', ') 
        FROM factura_ordenes_trabajo fot 
        JOIN ordenes_trabajo ot ON fot.id_ot = ot.id_ot 
        WHERE fot.id_factura = f.id_factura
    ) AS lista_ots_asociadas,

    -- Estado del pago
    COALESCE(p.forma_pago, 'PENDIENTE') AS metodo_pago,
    p.referencia AS referencia_pago

FROM facturas f
-- Unimos con la tabla puente para llegar al cliente
LEFT JOIN factura_ordenes_trabajo fot ON f.id_factura = fot.id_factura
LEFT JOIN ordenes_trabajo ot ON fot.id_ot = ot.id_ot
LEFT JOIN vehiculos v ON ot.id_vehiculo = v.id_vehiculo
LEFT JOIN clientes c ON v.id_cliente = c.id_cliente
-- Unimos con pagos si existen
LEFT JOIN pago_facturas pf ON f.id_factura = pf.id_factura
LEFT JOIN pagos p ON pf.id_pago = p.id_pago

GROUP BY f.id_factura, c.id_cliente, p.forma_pago, p.referencia;

COMMENT ON VIEW vw_facturas_detalladas IS 
    'Vista maestra de facturación. Consolida el encabezado de la factura, datos del cliente y los métodos de pago aplicados.';