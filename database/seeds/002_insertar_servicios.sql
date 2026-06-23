-- =============================================================================
-- Semilla: 002_insertar_servicios.sql
-- Descripción: Inserta el catálogo inicial de servicios ofrecidos por el
--              Taller de Refrigeración Automotriz. Cubre diagnóstico,
--              recargas, reparaciones y mantenimientos del sistema HVAC.
-- Autor: Sebastián Ventura - Módulo de Base de Datos
-- Fecha: 2026-06-23
-- Motor: PostgreSQL
-- Dependencias: 004_crear_servicios_orden_trabajo_servicios.sql
-- Nota: Usa ON CONFLICT DO NOTHING para ser idempotente. El script puede
--       ejecutarse más de una vez sin generar duplicados ni errores.
-- =============================================================================


-- =============================================================================
-- CATÁLOGO INICIAL DE SERVICIOS
-- Tabla destino: servicios
-- =============================================================================

INSERT INTO servicios (nombre, descripcion, precio_base, activo)
VALUES

    -- ------------------------------------------------------------------
    -- Diagnóstico
    -- ------------------------------------------------------------------
    (
        'Diagnóstico de aire acondicionado',
        'Inspección completa del sistema de refrigeración automotriz: '
        'verificación de presiones, temperatura de salida, estado del compresor, '
        'condensador, evaporador y componentes eléctricos del sistema HVAC.',
        850.00,
        TRUE
    ),

    -- ------------------------------------------------------------------
    -- Recargas
    -- ------------------------------------------------------------------
    (
        'Recarga de refrigerante R-134a',
        'Evacuación del sistema y recarga con refrigerante R-134a según '
        'especificaciones del fabricante. Incluye verificación de presiones '
        'de alta y baja después de la recarga.',
        1200.00,
        TRUE
    ),

    (
        'Recarga de refrigerante R-1234yf',
        'Evacuación del sistema y recarga con refrigerante R-1234yf para '
        'vehículos de última generación. Incluye verificación de presiones '
        'de alta y baja después de la recarga.',
        2500.00,
        TRUE
    ),

    -- ------------------------------------------------------------------
    -- Reparaciones
    -- ------------------------------------------------------------------
    (
        'Reparación de fuga en el sistema',
        'Detección de fuga mediante prueba de presión o gas trazador UV, '
        'reparación del punto de fuga (manguera, fitting, soldadura o sello) '
        'y recarga del refrigerante correspondiente.',
        1800.00,
        TRUE
    ),

    (
        'Cambio de compresor',
        'Desmontaje del compresor defectuoso, instalación de compresor nuevo '
        'o reconstruido, cambio de aceite del sistema, evacuación y recarga '
        'de refrigerante. Incluye prueba de funcionamiento.',
        6500.00,
        TRUE
    ),

    (
        'Cambio de condensador',
        'Desmontaje del condensador dañado o con obstrucción, instalación '
        'del condensador nuevo, limpieza de la zona, evacuación y recarga '
        'del sistema. Incluye prueba de presiones.',
        4200.00,
        TRUE
    ),

    (
        'Cambio de válvula de expansión',
        'Sustitución de la válvula de expansión termostática (TXV) o '
        'dispositivo de orificio fijo (FOD) según el sistema del vehículo. '
        'Incluye evacuación y recarga del refrigerante.',
        2800.00,
        TRUE
    ),

    (
        'Cambio de secador / acumulador',
        'Sustitución del filtro-secador o acumulador del sistema de A/C. '
        'Componente recomendado al abrir el circuito. Incluye evacuación '
        'y recarga del refrigerante.',
        1500.00,
        TRUE
    ),

    -- ------------------------------------------------------------------
    -- Mantenimiento
    -- ------------------------------------------------------------------
    (
        'Limpieza de evaporador',
        'Desmontaje del tablero o acceso al evaporador, limpieza profunda '
        'con producto bactericida y antimoho, eliminación de malos olores '
        'y reinstalación. Incluye prueba de funcionamiento.',
        2200.00,
        TRUE
    ),

    (
        'Mantenimiento preventivo de A/C',
        'Revisión general del sistema de refrigeración: verificación de '
        'presiones, limpieza del condensador, revisión de correas y '
        'mangueras, desinfección del evaporador y verificación eléctrica. '
        'No incluye recarga de refrigerante.',
        1100.00,
        TRUE
    ),

    (
        'Cambio de filtro de cabina',
        'Sustitución del filtro de habitáculo (antipolen) del sistema de '
        'ventilación. Mejora la calidad del aire interior y el rendimiento '
        'del sistema de A/C.',
        350.00,
        TRUE
    ),

    (
        'Revisión eléctrica del sistema HVAC',
        'Diagnóstico eléctrico del sistema de calefacción, ventilación y '
        'aire acondicionado: verificación de fusibles, relevadores, '
        'motor del soplador, resistencias, sensores de temperatura y '
        'módulo de control del clima.',
        950.00,
        TRUE
    )

ON CONFLICT (nombre) DO NOTHING;
