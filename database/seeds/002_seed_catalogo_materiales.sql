-- =============================================================================
-- Seed: 002_seed_catalogo_materiales.sql
-- Descripción: Puebla el catálogo unificado de inventario con repuestos,
--              gases refrigerantes y materiales consumibles.
-- Motor: PostgreSQL
-- =============================================================================

INSERT INTO materiales (
    nombre, 
    descripcion, 
    categoria, 
    unidad_medida, 
    stock_actual, 
    stock_minimo, 
    costo_unitario, 
    precio_venta
)
VALUES
    -- =========================================================================
    -- CATEGORÍA: REPUESTOS
    -- =========================================================================
    (
        'Filtro de Cabina Universal', 
        'Filtro antipolen genérico de alta retención para vehículos sedán', 
        'REPUESTO', 'UNIDAD', 50, 10, 250.00, 450.00
    ),
    (
        'Compresor 12V Denso', 
        'Compresor de A/C genérico marca Denso, compatible con modelos asiáticos', 
        'REPUESTO', 'UNIDAD', 5, 2, 8500.00, 12000.00
    ),
    (
        'Válvula de Expansión en Bloque', 
        'Válvula de expansión térmica de aluminio tipo bloque', 
        'REPUESTO', 'UNIDAD', 15, 5, 800.00, 1500.00
    ),
    (
        'Evaporador Universal de Aluminio', 
        'Panel evaporador de aluminio de alta transferencia térmica', 
        'REPUESTO', 'UNIDAD', 8, 3, 2200.00, 3800.00
    ),

    -- =========================================================================
    -- CATEGORÍA: REFRIGERANTES 
    -- (Nota: Medidos en onzas para poder fraccionar descargas precisas en OT)
    -- =========================================================================
    (
        'Gas Refrigerante R-134a', 
        'Cilindro fraccionado para consumo directo en taller', 
        'REFRIGERANTE', 'ONZAS', 480, 50, 15.00, 45.00
    ),
    (
        'Gas Refrigerante R-1234yf', 
        'Gas ecológico de nueva generación para vehículos modernos (modelo 2017+)', 
        'REFRIGERANTE', 'ONZAS', 200, 30, 85.00, 190.00
    ),

    -- =========================================================================
    -- CATEGORÍA: CONSUMIBLES
    -- =========================================================================
    (
        'Aceite Sintético PAG 46', 
        'Aceite lubricante de alta viscosidad para compresores de A/C', 
        'CONSUMIBLE', 'ONZAS', 120, 20, 50.00, 120.00
    ),
    (
        'Tinte Detector de Fugas UV', 
        'Líquido fluorescente concentrado para detección de microfugas', 
        'CONSUMIBLE', 'ONZAS', 60, 10, 150.00, 300.00
    ),
    (
        'Limpiador de Contactos Eléctricos', 
        'Spray dieléctrico de secado rápido para limpieza de sensores', 
        'CONSUMIBLE', 'UNIDAD', 25, 5, 350.00, 550.00
    );