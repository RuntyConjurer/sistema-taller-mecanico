-- =========================================================
-- Vista para historial técnico completo
-- =========================================================
DROP VIEW IF EXISTS vw_historial_tecnico_completo;

CREATE OR REPLACE VIEW vw_historial_tecnico_completo AS
SELECT
    h.id_historial,
    h.descripcion,
    h.recomendaciones,
    h.fecha_registro,

    ot.id_ot,
    ot.estado AS estado_ot,
    ot.fecha_apertura,
    ot.fecha_cierre,

    v.id_vehiculo,
    v.chasis,
    v.marca,
    v.modelo,
    v.placa,
    v.anio,
    v.tipo_refrigerante,

    c.id_cliente,
    c.nombre AS nombre_cliente,
    c.identificacion AS identificacion_cliente,
    c.telefono AS telefono_cliente,
    c.email AS email_cliente,

    u.id_usuario,
    u.nombre AS registrado_por

FROM historial_tecnico h
INNER JOIN ordenes_trabajo ot
    ON ot.id_ot = h.id_ot
INNER JOIN vehiculos v
    ON v.id_vehiculo = h.id_vehiculo
INNER JOIN clientes c
    ON c.id_cliente = v.id_cliente
LEFT JOIN usuarios u
    ON u.id_usuario = h.registrado_por;