-- =============================================================================
-- Vista: vw_ordenes_trabajo_resumen
-- Descripción: Vista consolidada para tableros de control operativos. Resuelve
--              todas las relaciones de una Orden de Trabajo en una sola consulta
--              legible para la interfaz de usuario.
-- Motor: PostgreSQL
-- =============================================================================

CREATE OR REPLACE VIEW vw_ordenes_trabajo_resumen AS
SELECT 
    -- Identificadores principales
    ot.id_ot,
    ot.estado AS estado_ot,
    ot.fecha_apertura,
    ot.fecha_cierre,
    
    -- Cálculo dinámico de tiempo transcurrido (en días o fracción)
    CASE 
        WHEN ot.fecha_cierre IS NOT NULL THEN 
            ROUND(EXTRACT(EPOCH FROM (ot.fecha_cierre - ot.fecha_apertura)) / 86400, 1)
        ELSE 
            ROUND(EXTRACT(EPOCH FROM (NOW() - ot.fecha_apertura)) / 86400, 1)
    END AS dias_abierta,

    -- Datos del Sucursal
    s.id_sucursal,
    s.nombre AS sucursal_nombre,

    -- Datos del Cliente
    c.id_cliente,
    c.nombre AS cliente_nombre,
    c.telefono AS cliente_telefono,
    c.tipo_cliente,

    -- Datos del Vehículo
    v.id_vehiculo,
    v.placa,
    v.marca,
    v.modelo,
    v.anio,
    v.color,
    v.chasis,

    -- Datos del Técnico Asignado (Puede ser nulo si recién se abre)
    u.id_usuario AS id_tecnico,
    COALESCE(u.nombre, 'Sin Asignar') AS tecnico_asignado,

    -- Información técnica de origen y problemas
    ot.id_cita,
    ot.descripcion_problema,
    ot.observaciones

FROM ordenes_trabajo ot
INNER JOIN vehiculos v ON ot.id_vehiculo = v.id_vehiculo
INNER JOIN clientes c ON v.id_cliente = c.id_cliente
LEFT JOIN sucursales s ON ot.id_sucursal = s.id_sucursal
LEFT JOIN usuarios u ON ot.id_usuario = u.id_usuario;

COMMENT ON VIEW vw_ordenes_trabajo_resumen IS 
    'Resumen operativo de órdenes de trabajo con resolución de nombres de clientes, vehículos, técnicos y tiempo de atención.';