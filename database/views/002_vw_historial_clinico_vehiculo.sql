-- =============================================================================
-- Vista: vw_historial_clinico_vehiculo
-- Descripción: Genera el expediente técnico cronológico de cada vehículo. 
--              Consolida la información del vehículo, los diagnósticos 
--              detectados, el trabajo realizado y las recomendaciones futuras.
-- Motor: PostgreSQL
-- =============================================================================

CREATE OR REPLACE VIEW vw_historial_clinico_vehiculo AS
SELECT 
    -- Identificadores del Vehículo
    v.id_vehiculo,
    v.placa,
    v.chasis,
    v.marca,
    v.modelo,
    v.anio,

    -- Fechas y Contexto del Evento
    ht.id_historial,
    ht.fecha_registro AS fecha_intervencion,
    ot.id_ot,
    ot.estado AS estado_ot,

    -- Información del Diagnóstico (Puede ser nulo si no aplica)
    d.falla_detectada AS diagnostico_previo,
    d.presion_baja,
    d.presion_alta,

    -- Detalle de la Intervención
    ht.descripcion AS trabajo_realizado,
    ht.recomendaciones,

    -- Responsable
    COALESCE(u.nombre, 'Sistema / Sin Registro') AS tecnico_responsable

FROM historial_tecnico ht
INNER JOIN vehiculos v ON ht.id_vehiculo = v.id_vehiculo
INNER JOIN ordenes_trabajo ot ON ht.id_ot = ot.id_ot
LEFT JOIN diagnosticos d ON ot.id_ot = d.id_ot
LEFT JOIN usuarios u ON ht.registrado_por = u.id_usuario;

COMMENT ON VIEW vw_historial_clinico_vehiculo IS 
    'Expediente clínico del vehículo. Muestra la línea de tiempo de diagnósticos, trabajos realizados y recomendaciones del técnico.';