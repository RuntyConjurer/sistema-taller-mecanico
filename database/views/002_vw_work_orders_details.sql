-- =========================================================
-- Vista para ordenes de trabajo
-- =========================================================
DROP VIEW IF EXISTS vw_ordenes_trabajo_detalle;

CREATE OR REPLACE VIEW vw_ordenes_trabajo_detalle AS
SELECT
    ot.id_ot,
    ot.estado,
    ot.descripcion_problema,
    ot.observaciones,
    ot.fecha_apertura,
    ot.fecha_cierre,

    c.id_cliente,
    c.nombre AS nombre_cliente,
    c.identificacion AS identificacion_cliente,
    c.telefono AS telefono_cliente,
    c.email AS email_cliente,

    v.id_vehiculo,
    v.chasis,
    v.marca,
    v.modelo,
    v.placa,
    v.anio,
    v.tipo_refrigerante,

    s.id_sucursal,
    s.nombre AS nombre_sucursal,

    u.id_usuario,
    u.nombre AS tecnico_asignado,

    cit.id_cita,
    cit.fecha_cita,
    cit.estado AS estado_cita,
    cit.motivo AS motivo_cita,

    d.id_diagnostico,
    d.presion_baja,
    d.presion_alta,
    d.temperatura,
    d.falla_detectada,
    d.observaciones AS observaciones_diagnostico,
    d.fecha_diagnostico,

    COALESCE(serv.total_servicios, 0) AS total_servicios,
    COALESCE(mat.total_materiales, 0) AS total_materiales,
    COALESCE(serv.total_general_servicios, 0) AS monto_servicios,
    COALESCE(mat.total_general_materiales, 0) AS monto_materiales,
    COALESCE(serv.total_general_servicios, 0) + COALESCE(mat.total_general_materiales, 0) AS total_estimado

FROM ordenes_trabajo ot
INNER JOIN vehiculos v
    ON v.id_vehiculo = ot.id_vehiculo
INNER JOIN clientes c
    ON c.id_cliente = v.id_cliente
LEFT JOIN sucursales s
    ON s.id_sucursal = ot.id_sucursal
LEFT JOIN usuarios u
    ON u.id_usuario = ot.id_usuario
LEFT JOIN citas cit
    ON cit.id_cita = ot.id_cita
LEFT JOIN diagnosticos d
    ON d.id_ot = ot.id_ot

LEFT JOIN (
    SELECT
        ots.id_ot,
        COUNT(*) AS total_servicios,
        SUM(ots.subtotal) AS total_general_servicios
    FROM orden_trabajo_servicios ots
    GROUP BY ots.id_ot
) serv
    ON serv.id_ot = ot.id_ot

LEFT JOIN (
    SELECT
        otm.id_ot,
        COUNT(*) AS total_materiales,
        SUM(otm.subtotal) AS total_general_materiales
    FROM orden_trabajo_materiales otm
    GROUP BY otm.id_ot
) mat
    ON mat.id_ot = ot.id_ot;