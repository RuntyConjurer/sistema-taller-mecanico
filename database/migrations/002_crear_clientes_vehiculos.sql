-- =============================================================================
-- Migración: 002_crear_clientes_vehiculos.sql
-- Descripción: Crea las tablas del núcleo operativo: clientes y vehiculos
-- Autor: Persona 1 - Módulo de Base de Datos
-- Fecha: 2026-06-23
-- Motor: PostgreSQL
-- Normalización: 3FN
-- =============================================================================


-- =============================================================================
-- TABLA: clientes
-- Descripción: Almacena la información de los clientes del taller, tanto
--              personas naturales como empresas.
-- =============================================================================

CREATE TABLE clientes (
    id_cliente        BIGSERIAL       NOT NULL,
    tipo_cliente      VARCHAR(10)     NOT NULL,
    tipo_identificacion VARCHAR(15)   NOT NULL,
    identificacion    VARCHAR(20)     NOT NULL,
    nombre            VARCHAR(150)    NOT NULL,
    telefono          VARCHAR(20),
    direccion         VARCHAR(250),
    email             VARCHAR(100),
    activo            BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Llave primaria
    CONSTRAINT pk_clientes
        PRIMARY KEY (id_cliente),

    -- Unicidad en campos de identificación y contacto
    CONSTRAINT uq_clientes_identificacion
        UNIQUE (identificacion),
    CONSTRAINT uq_clientes_email
        UNIQUE (email),

    -- Validación del tipo de cliente
    CONSTRAINT ck_clientes_tipo_cliente
        CHECK (tipo_cliente IN ('PERSONA', 'EMPRESA')),

    -- Validación del tipo de identificación
    CONSTRAINT ck_clientes_tipo_identificacion
        CHECK (tipo_identificacion IN ('CEDULA', 'RNC', 'PASAPORTE'))
);

-- Comentario de tabla
COMMENT ON TABLE clientes IS
    'Clientes del taller: personas naturales y empresas. Cada cliente debe tener un tipo de identificación válido.';

-- Comentarios de columnas
COMMENT ON COLUMN clientes.id_cliente          IS 'Identificador único autoincremental del cliente.';
COMMENT ON COLUMN clientes.tipo_cliente        IS 'Clasificación del cliente: PERSONA o EMPRESA.';
COMMENT ON COLUMN clientes.tipo_identificacion IS 'Tipo de documento de identidad: CEDULA, RNC o PASAPORTE.';
COMMENT ON COLUMN clientes.identificacion      IS 'Número de identificación del cliente. Único en el sistema.';
COMMENT ON COLUMN clientes.nombre              IS 'Nombre completo de la persona o razón social de la empresa.';
COMMENT ON COLUMN clientes.telefono            IS 'Número de teléfono de contacto del cliente.';
COMMENT ON COLUMN clientes.direccion           IS 'Dirección física del cliente.';
COMMENT ON COLUMN clientes.email               IS 'Correo electrónico del cliente. Único en el sistema.';
COMMENT ON COLUMN clientes.activo              IS 'Indica si el cliente está activo. Por defecto TRUE.';
COMMENT ON COLUMN clientes.creado_en           IS 'Fecha y hora de registro del cliente (con zona horaria).';


-- =============================================================================
-- TABLA: vehiculos
-- Descripción: Almacena los vehículos asociados a los clientes registrados.
--              Todo vehículo debe pertenecer a un cliente existente.
-- =============================================================================

CREATE TABLE vehiculos (
    id_vehiculo       BIGSERIAL       NOT NULL,
    id_cliente        BIGINT          NOT NULL,
    chasis            VARCHAR(50)     NOT NULL,
    marca             VARCHAR(80)     NOT NULL,
    modelo            VARCHAR(80)     NOT NULL,
    placa             VARCHAR(20),
    color             VARCHAR(50),
    anio              SMALLINT,
    tipo_refrigerante VARCHAR(60),
    activo            BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Llave primaria
    CONSTRAINT pk_vehiculos
        PRIMARY KEY (id_vehiculo),

    -- Llave foránea hacia clientes
    CONSTRAINT fk_vehiculos_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Unicidad en campos de identificación del vehículo
    CONSTRAINT uq_vehiculos_chasis
        UNIQUE (chasis),
    CONSTRAINT uq_vehiculos_placa
        UNIQUE (placa),

    -- Validación de año del vehículo: desde 1980 hasta el año actual + 1
    CONSTRAINT ck_vehiculos_anio
        CHECK (anio BETWEEN 1980 AND EXTRACT(YEAR FROM NOW())::SMALLINT + 1)
);

-- Comentario de tabla
COMMENT ON TABLE vehiculos IS
    'Vehículos registrados en el taller. Cada vehículo debe estar asociado obligatoriamente a un cliente registrado.';

-- Comentarios de columnas
COMMENT ON COLUMN vehiculos.id_vehiculo       IS 'Identificador único autoincremental del vehículo.';
COMMENT ON COLUMN vehiculos.id_cliente        IS 'Referencia al cliente propietario del vehículo. Obligatorio.';
COMMENT ON COLUMN vehiculos.chasis            IS 'Número de chasis (VIN) del vehículo. Único en el sistema.';
COMMENT ON COLUMN vehiculos.marca             IS 'Marca del vehículo (ej: Toyota, Ford, Chevrolet).';
COMMENT ON COLUMN vehiculos.modelo            IS 'Modelo del vehículo (ej: Corolla, F-150, Silverado).';
COMMENT ON COLUMN vehiculos.placa             IS 'Matrícula o placa del vehículo. Única en el sistema.';
COMMENT ON COLUMN vehiculos.color             IS 'Color del vehículo.';
COMMENT ON COLUMN vehiculos.anio              IS 'Año de fabricación del vehículo. Rango válido: 1980 hasta año actual + 1.';
COMMENT ON COLUMN vehiculos.tipo_refrigerante IS 'Tipo de refrigerante del sistema de A/C (ej: R-134a, R-1234yf).';
COMMENT ON COLUMN vehiculos.activo            IS 'Indica si el vehículo está activo en el sistema. Por defecto TRUE.';
COMMENT ON COLUMN vehiculos.creado_en         IS 'Fecha y hora de registro del vehículo (con zona horaria).';
