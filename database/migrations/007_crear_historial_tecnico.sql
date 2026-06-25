-- =============================================================================
-- Migración: 007_crear_historial_tecnico.sql
-- Descripción: Crea la tabla de historial técnico de vehículos. Registra
--              eventos técnicos relevantes (reparaciones, mantenimientos)
--              asociados a un vehículo y a una orden de trabajo.
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 001_crear_usuarios_roles_sucursales.sql
--               002_crear_clientes_vehiculos.sql
--               003_crear_citas_ordenes_diagnosticos.sql
-- =============================================================================


-- =============================================================================
-- TABLA: historial_tecnico
-- Descripción: Almacena el historial de eventos técnicos realizados sobre
--              un vehículo. Cada registro está asociado obligatoriamente a
--              un vehículo y a una orden de trabajo, lo que permite rastrear
--              el origen de cada intervención técnica.
-- Dependencias: vehiculos, ordenes_trabajo, usuarios
-- =============================================================================

CREATE TABLE historial_tecnico (
    id_historial    BIGSERIAL       NOT NULL,
    id_vehiculo     BIGINT          NOT NULL,
    id_ot           BIGINT          NOT NULL,
    descripcion     TEXT            NOT NULL,
    recomendaciones TEXT,
    registrado_por  BIGINT,
    fecha_registro  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Llave primaria
    CONSTRAINT pk_historial_tecnico
        PRIMARY KEY (id_historial),

    -- Llave foránea hacia vehiculos
    CONSTRAINT fk_historial_vehiculo
        FOREIGN KEY (id_vehiculo)
        REFERENCES vehiculos (id_vehiculo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Llave foránea hacia ordenes_trabajo
    CONSTRAINT fk_historial_ot
        FOREIGN KEY (id_ot)
        REFERENCES ordenes_trabajo (id_ot)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Llave foránea hacia usuarios (técnico que registró el evento)
    CONSTRAINT fk_historial_usuario
        FOREIGN KEY (registrado_por)
        REFERENCES usuarios (id_usuario)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

-- Comentario de tabla
COMMENT ON TABLE historial_tecnico IS
    'Historial de eventos técnicos por vehículo. Permite consultar reparaciones y mantenimientos anteriores asociados a una orden de trabajo.';

-- Comentarios de columnas
COMMENT ON COLUMN historial_tecnico.id_historial    IS 'Identificador único autoincremental del registro de historial.';
COMMENT ON COLUMN historial_tecnico.id_vehiculo     IS 'Vehículo al que corresponde el evento técnico. Obligatorio.';
COMMENT ON COLUMN historial_tecnico.id_ot           IS 'Orden de trabajo de la que se origina el evento técnico. Obligatorio.';
COMMENT ON COLUMN historial_tecnico.descripcion     IS 'Descripción detallada del trabajo realizado o evento técnico registrado.';
COMMENT ON COLUMN historial_tecnico.recomendaciones IS 'Recomendaciones del técnico para mantenimientos o revisiones futuras.';
COMMENT ON COLUMN historial_tecnico.registrado_por  IS 'Técnico o usuario que registró el evento. Referencia a usuarios(id_usuario).';
COMMENT ON COLUMN historial_tecnico.fecha_registro  IS 'Fecha y hora en que se registró el evento técnico (con zona horaria).';