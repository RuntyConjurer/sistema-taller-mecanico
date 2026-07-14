-- =============================================================================
-- Vista: vw_estado_inventario
-- Descripción: Vista consolidada del catálogo de materiales. Calcula en tiempo
--              real el estado del stock para facilitar la reposición, compras
--              y auditorías financieras del taller.
-- Motor: PostgreSQL
-- =============================================================================

CREATE OR REPLACE VIEW vw_estado_inventario AS
SELECT 
    id_material,
    nombre,
    descripcion,
    categoria,
    unidad_medida,
    stock_actual,
    stock_minimo,
    costo_unitario,
    precio_venta,
    
    -- Cálculo dinámico del estado del inventario para alertas visuales
    CASE 
        WHEN stock_actual <= 0 THEN 'AGOTADO'
        WHEN stock_actual <= stock_minimo THEN 'REORDEN_NECESARIA'
        ELSE 'STOCK_OPTIMO'
    END AS estado_stock,
    
    -- Valorización financiera del inventario actual
    (stock_actual * costo_unitario) AS valor_total_inventario

FROM materiales;

COMMENT ON VIEW vw_estado_inventario IS 
    'Vista de auditoría de inventario. Proporciona alertas automatizadas de reabastecimiento basadas en el stock mínimo y calcula la valorización de los materiales en almacén.';