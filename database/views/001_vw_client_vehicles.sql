-- =========================================================
-- Vista para clientes y vehiculos
-- =========================================================
DROP VIEW IF EXISTS vw_clientes_vehiculos;

CREATE OR REPLACE VIEW vw_clientes_vehiculos AS
SELECT
    c.id_cliente,
    c.tipo_cliente,
    c.tipo_identificacion,
    c.identificacion,
    c.nombre AS nombre_cliente,
    c.telefono AS telefono_cliente,
    c.direccion AS direccion_cliente,
    c.email AS email_cliente,
    c.activo AS cliente_activo,
    c.creado_en AS cliente_creado_en,

    v.id_vehiculo,
    v.chasis,
    v.marca,
    v.modelo,
    v.placa,
    v.color,
    v.anio,
    v.tipo_refrigerante,
    v.activo AS vehiculo_activo,
    v.creado_en AS vehiculo_creado_en
FROM clientes c
INNER JOIN vehiculos v
    ON v.id_cliente = c.id_cliente;