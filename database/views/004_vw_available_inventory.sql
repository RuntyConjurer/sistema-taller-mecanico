-- =========================================================
-- Vista para inventario disponible
-- =========================================================
DROP VIEW IF EXISTS vw_inventario_disponible;

CREATE OR REPLACE VIEW vw_inventario_disponible AS
SELECT
    'MATERIAL' AS tipo_item,
    m.id_material AS id_item,
    m.nombre,
    m.descripcion,
    m.unidad_medida,
    m.stock_actual,
    m.stock_minimo,
    m.costo_unitario,
    m.precio_venta,
    m.activo,
    CASE
        WHEN m.stock_actual <= m.stock_minimo THEN 'BAJO'
        ELSE 'OK'
    END AS estado_stock
FROM materiales m

UNION ALL

SELECT
    'REFRIGERANTE' AS tipo_item,
    r.id_refrigerante AS id_item,
    r.nombre,
    r.descripcion,
    r.unidad_medida,
    r.stock_actual,
    r.stock_minimo,
    r.costo_unitario,
    r.precio_venta,
    r.activo,
    CASE
        WHEN r.stock_actual <= r.stock_minimo THEN 'BAJO'
        ELSE 'OK'
    END AS estado_stock
FROM refrigerantes r;