-- =============================================================================
-- Migración: 003_crear_citas_ordenes_diagnosticos.sql
-- Descripción: Crea las tablas del flujo técnico inicial del taller:
--              citas, ordenes_trabajo y diagnosticos
-- Autor: Sebastián Ventura - Módulo de Base de Datos
-- Fecha: 2026-06-23
-- Motor: PostgreSQL
-- Normalización: 3FN
-- Dependencias: 002_crear_clientes_vehiculos.sql
-- Nota: La tabla sucursales y la tabla usuarios serán creadas en migraciones
--       posteriores. Las llaves foráneas hacia ellas se agregan en este script
--       como referencias adelantadas (diferidas por migración separada).
-- =============================================================================


-- =============================================================================
-- TABLA: citas
-- Descripción: Registra las citas programadas por los clientes para traer
--              sus vehículos al taller. Puede o no derivar en una orden
--              de trabajo.
-- Dependencias: clientes, vehiculos
--              (sucursales referenciada — tabla creada en migración posterior)
-- =============================================================================

CREATE TABLE citas (
    id_cita       BIGSERIAL       NOT NULL,
    id_cliente    BIGINT          NOT NULL,
    id_vehiculo   BIGINT          NOT NULL,
    id_sucursal   BIGINT,
    fecha_cita    TIMESTAMPTZ     NOT NULL,
    estado        VARCHAR(20)     NOT NULL DEFAULT 'PROGRAMADA',
    motivo        VARCHAR(250),
    observaciones TEXT,
    creado_en     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Llave primaria
    CONSTRAINT pk_citas
        PRIMARY KEY (id_cita),

    -- Llave foránea hacia clientes
    CONSTRAINT fk_citas_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Llave foránea hacia vehiculos
    CONSTRAINT fk_citas_vehiculo
        FOREIGN KEY (id_vehiculo)
        REFERENCES vehiculos (id_vehiculo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Validación de estados permitidos
    CONSTRAINT ck_citas_estado
        CHECK (estado IN ('PROGRAMADA', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA', 'NO_ASISTIO'))
);

-- Nota: La FK hacia sucursales(id_sucursal) se agregará en la migración
--       que cree dicha tabla, mediante ALTER TABLE citas ADD CONSTRAINT ...

-- Comentario de tabla
COMMENT ON TABLE citas IS
    'Citas programadas por los clientes para traer sus vehículos al taller. Puede derivar en una orden de trabajo.';

-- Comentarios de columnas
COMMENT ON COLUMN citas.id_cita       IS 'Identificador único autoincremental de la cita.';
COMMENT ON COLUMN citas.id_cliente    IS 'Cliente que agenda la cita. Referencia a clientes(id_cliente). Obligatorio.';
COMMENT ON COLUMN citas.id_vehiculo   IS 'Vehículo para el que se agenda la cita. Referencia a vehiculos(id_vehiculo). Obligatorio.';
COMMENT ON COLUMN citas.id_sucursal   IS 'Sucursal donde se atenderá la cita. Opcional (referencia diferida a sucursales).';
COMMENT ON COLUMN citas.fecha_cita    IS 'Fecha y hora programada para la cita (con zona horaria).';
COMMENT ON COLUMN citas.estado        IS 'Estado actual de la cita: PROGRAMADA, CONFIRMADA, CANCELADA, COMPLETADA, NO_ASISTIO.';
COMMENT ON COLUMN citas.motivo        IS 'Motivo o descripción breve del servicio solicitado en la cita.';
COMMENT ON COLUMN citas.observaciones IS 'Observaciones adicionales sobre la cita.';
COMMENT ON COLUMN citas.creado_en     IS 'Fecha y hora de registro de la cita (con zona horaria).';


-- =============================================================================
-- TABLA: ordenes_trabajo
-- Descripción: Representa el ciclo de vida de un trabajo técnico realizado
--              sobre un vehículo. Puede originarse desde una cita o abrirse
--              directamente. No puede cerrarse sin diagnóstico (regla a
--              implementar en migración posterior con constraint o trigger).
-- Dependencias: vehiculos, citas
--              (usuarios y sucursales referenciadas — tablas en migraciones
--               posteriores)
-- =============================================================================

CREATE TABLE ordenes_trabajo (
    id_ot               BIGSERIAL       NOT NULL,
    id_vehiculo         BIGINT          NOT NULL,
    id_usuario          BIGINT,
    id_sucursal         BIGINT,
    id_cita             BIGINT,
    estado              VARCHAR(20)     NOT NULL DEFAULT 'ABIERTA',
    descripcion_problema TEXT,
    observaciones       TEXT,
    fecha_apertura      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    fecha_cierre        TIMESTAMPTZ,

    -- Llave primaria
    CONSTRAINT pk_ordenes_trabajo
        PRIMARY KEY (id_ot),

    -- Llave foránea hacia vehiculos
    CONSTRAINT fk_ot_vehiculo
        FOREIGN KEY (id_vehiculo)
        REFERENCES vehiculos (id_vehiculo)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Llave foránea hacia citas (opcional)
    CONSTRAINT fk_ot_cita
        FOREIGN KEY (id_cita)
        REFERENCES citas (id_cita)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    -- Validación de estados permitidos
    CONSTRAINT ck_ot_estado
        CHECK (estado IN ('ABIERTA', 'EN_DIAGNOSTICO', 'EN_REPARACION', 'FACTURADA', 'CERRADA', 'CANCELADA')),

    -- La fecha de cierre no puede ser anterior a la fecha de apertura
    CONSTRAINT ck_ot_fechas
        CHECK (fecha_cierre IS NULL OR fecha_cierre >= fecha_apertura)
);

-- Nota: Las FK hacia usuarios(id_usuario) y sucursales(id_sucursal) se
--       agregarán mediante ALTER TABLE en las migraciones correspondientes.

-- Comentario de tabla
COMMENT ON TABLE ordenes_trabajo IS
    'Órdenes de trabajo del taller. Representa el ciclo de vida técnico completo de un servicio sobre un vehículo.';

-- Comentarios de columnas
COMMENT ON COLUMN ordenes_trabajo.id_ot               IS 'Identificador único autoincremental de la orden de trabajo.';
COMMENT ON COLUMN ordenes_trabajo.id_vehiculo         IS 'Vehículo al que se le realiza el trabajo. Obligatorio.';
COMMENT ON COLUMN ordenes_trabajo.id_usuario          IS 'Técnico o usuario responsable de la OT. Opcional (referencia diferida a usuarios).';
COMMENT ON COLUMN ordenes_trabajo.id_sucursal         IS 'Sucursal donde se ejecuta el trabajo. Opcional (referencia diferida a sucursales).';
COMMENT ON COLUMN ordenes_trabajo.id_cita             IS 'Cita de origen de la OT. Opcional; puede abrirse sin cita previa.';
COMMENT ON COLUMN ordenes_trabajo.estado              IS 'Estado de la OT: ABIERTA, EN_DIAGNOSTICO, EN_REPARACION, FACTURADA, CERRADA, CANCELADA.';
COMMENT ON COLUMN ordenes_trabajo.descripcion_problema IS 'Descripción del problema reportado al momento de abrir la OT.';
COMMENT ON COLUMN ordenes_trabajo.observaciones       IS 'Observaciones adicionales del técnico o del proceso.';
COMMENT ON COLUMN ordenes_trabajo.fecha_apertura      IS 'Fecha y hora de apertura de la OT (con zona horaria). Por defecto NOW().';
COMMENT ON COLUMN ordenes_trabajo.fecha_cierre        IS 'Fecha y hora de cierre de la OT. Nulo mientras esté abierta.';


-- =============================================================================
-- TABLA: diagnosticos
-- Descripción: Almacena el diagnóstico técnico de refrigeración asociado a
--              una orden de trabajo. Relación 1:1 con ordenes_trabajo mediante
--              UNIQUE en id_ot (una OT tiene como máximo un diagnóstico
--              principal).
-- Dependencias: ordenes_trabajo
--              (usuarios referenciada — tabla en migración posterior)
-- =============================================================================

CREATE TABLE diagnosticos (
    id_diagnostico    BIGSERIAL       NOT NULL,
    id_ot             BIGINT          NOT NULL,
    presion_baja      NUMERIC(6, 2),
    presion_alta      NUMERIC(6, 2),
    temperatura       NUMERIC(5, 2),
    falla_detectada   TEXT            NOT NULL,
    observaciones     TEXT,
    creado_por        BIGINT,
    fecha_diagnostico TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Llave primaria
    CONSTRAINT pk_diagnosticos
        PRIMARY KEY (id_diagnostico),

    -- Unicidad sobre id_ot: una OT tiene un único diagnóstico principal
    CONSTRAINT uq_diagnosticos_id_ot
        UNIQUE (id_ot),

    -- Llave foránea hacia ordenes_trabajo
    CONSTRAINT fk_diagnosticos_ot
        FOREIGN KEY (id_ot)
        REFERENCES ordenes_trabajo (id_ot)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Validación: presiones deben ser valores positivos si se registran
    CONSTRAINT ck_diagnosticos_presion_baja
        CHECK (presion_baja IS NULL OR presion_baja >= 0),
    CONSTRAINT ck_diagnosticos_presion_alta
        CHECK (presion_alta IS NULL OR presion_alta >= 0)
);

-- Nota: La FK hacia usuarios(id_usuario) en creado_por se agregará mediante
--       ALTER TABLE en la migración correspondiente a usuarios.

-- Comentario de tabla
COMMENT ON TABLE diagnosticos IS
    'Diagnóstico técnico de refrigeración de una orden de trabajo. Relación 1:1 con ordenes_trabajo (una OT tiene máximo un diagnóstico principal).';

-- Comentarios de columnas
COMMENT ON COLUMN diagnosticos.id_diagnostico    IS 'Identificador único autoincremental del diagnóstico.';
COMMENT ON COLUMN diagnosticos.id_ot             IS 'Orden de trabajo a la que pertenece el diagnóstico. Único (1:1 con OT).';
COMMENT ON COLUMN diagnosticos.presion_baja      IS 'Lectura de presión baja del sistema de refrigeración (en PSI o bar).';
COMMENT ON COLUMN diagnosticos.presion_alta      IS 'Lectura de presión alta del sistema de refrigeración (en PSI o bar).';
COMMENT ON COLUMN diagnosticos.temperatura       IS 'Temperatura registrada durante el diagnóstico (en °C o °F).';
COMMENT ON COLUMN diagnosticos.falla_detectada   IS 'Descripción de la falla o condición técnica identificada. Obligatorio.';
COMMENT ON COLUMN diagnosticos.observaciones     IS 'Observaciones adicionales del técnico sobre el diagnóstico.';
COMMENT ON COLUMN diagnosticos.creado_por        IS 'Técnico o usuario que registró el diagnóstico. Opcional (referencia diferida a usuarios).';
COMMENT ON COLUMN diagnosticos.fecha_diagnostico IS 'Fecha y hora en que se realizó el diagnóstico (con zona horaria).';
