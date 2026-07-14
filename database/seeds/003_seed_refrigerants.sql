-- =========================================================
-- Datos iniciales para refrigerantes
-- =========================================================

INSERT INTO refrigerantes (
    nombre,
    descripcion,
    unidad_medida,
    stock_actual,
    stock_minimo,
    costo_unitario,
    precio_venta,
    activo
)
VALUES
    (
        'R-134a',
        'Refrigerante automotriz común para sistemas de aire acondicionado',
        'LIBRAS',
        0,
        10,
        0.00,
        0.00,
        TRUE
    ),
    (
        'R-1234yf',
        'Refrigerante de nueva generación para vehículos modernos',
        'LIBRAS',
        0,
        5,
        0.00,
        0.00,
        TRUE
    ),
    (
        'R-404A',
        'Refrigerante de uso técnico e industrial',
        'LIBRAS',
        0,
        5,
        0.00,
        0.00,
        TRUE
    ),
    (
        'R-22',
        'Refrigerante usado en equipos antiguos',
        'LIBRAS',
        0,
        5,
        0.00,
        0.00,
        TRUE
    )
ON CONFLICT (nombre) DO NOTHING;