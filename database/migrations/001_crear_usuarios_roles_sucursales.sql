-- =============================================================================
-- Migración: 001_crear_usuarios_roles_sucursales.sql
-- Descripción: Crea las tablas de configuración base del sistema:
--              sucursales, roles, usuarios y su relación.
-- Motor: PostgreSQL
-- Normalización: 3FN
-- =============================================================================


-- =============================================================================
-- TABLA: sucursales
-- Descripción: Almacena la información de las diferentes sucursales físicas 
--              del taller mecánico.
-- =============================================================================

CREATE TABLE sucursales (
    id_sucursal BIGSERIAL       NOT NULL,
    nombre      VARCHAR(100)    NOT NULL,
    direccion   TEXT            NOT NULL,
    telefono    VARCHAR(20),
    email       VARCHAR(120),
    activa      BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_sucursales PRIMARY KEY (id_sucursal)
);

COMMENT ON TABLE sucursales IS 'Sucursales o ubicaciones físicas del taller mecánico.';
COMMENT ON COLUMN sucursales.id_sucursal IS 'Identificador único autoincremental de la sucursal.';
COMMENT ON COLUMN sucursales.nombre IS 'Nombre comercial o identificador de la sucursal.';
COMMENT ON COLUMN sucursales.direccion IS 'Dirección física completa de la sucursal.';
COMMENT ON COLUMN sucursales.creado_en IS 'Fecha y hora de registro de la sucursal (con zona horaria).';


-- =============================================================================
-- TABLA: roles
-- Descripción: Catálogo de roles de sistema para el control de acceso y permisos.
-- =============================================================================

CREATE TABLE roles (
    id_rol      BIGSERIAL       NOT NULL,
    nombre      VARCHAR(50)     NOT NULL,
    descripcion TEXT,
    activo      BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en   TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_roles PRIMARY KEY (id_rol),
    CONSTRAINT uq_roles_nombre UNIQUE (nombre)
);

COMMENT ON TABLE roles IS 'Roles de usuario para gestionar permisos y accesos en el sistema.';
COMMENT ON COLUMN roles.id_rol IS 'Identificador único autoincremental del rol.';
COMMENT ON COLUMN roles.nombre IS 'Nombre del rol (ej: ADMINISTRADOR, TECNICO, CAJERO). Único.';
COMMENT ON COLUMN roles.creado_en IS 'Fecha y hora de creación del rol (con zona horaria).';


-- =============================================================================
-- TABLA: usuarios
-- Descripción: Almacena los usuarios (empleados, técnicos, administradores) 
--              que acceden al sistema del taller.
-- =============================================================================

CREATE TABLE usuarios (
    id_usuario          BIGSERIAL       NOT NULL,
    id_sucursal         BIGINT,
    tipo_identificacion VARCHAR(15)     NOT NULL,
    identificacion      VARCHAR(20)     NOT NULL,
    nombre              VARCHAR(120)    NOT NULL,
    email               VARCHAR(120)    NOT NULL,
    password_hash       TEXT            NOT NULL,
    telefono            VARCHAR(20),
    activo              BOOLEAN         NOT NULL DEFAULT TRUE,
    creado_en           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_usuarios PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuarios_identificacion UNIQUE (identificacion),
    CONSTRAINT uq_usuarios_email UNIQUE (email),
    
    CONSTRAINT fk_usuarios_sucursal FOREIGN KEY (id_sucursal) REFERENCES sucursales (id_sucursal) ON UPDATE CASCADE ON DELETE RESTRICT,
    
    CONSTRAINT ck_usuarios_tipo_identificacion CHECK (tipo_identificacion IN ('CEDULA', 'PASAPORTE'))
);

COMMENT ON TABLE usuarios IS 'Usuarios del sistema (empleados y administradores del taller).';
COMMENT ON COLUMN usuarios.id_usuario IS 'Identificador único autoincremental del usuario.';
COMMENT ON COLUMN usuarios.id_sucursal IS 'Sucursal principal a la que pertenece el usuario. Opcional.';
COMMENT ON COLUMN usuarios.tipo_identificacion IS 'Tipo de documento legal del empleado (CEDULA o PASAPORTE).';
COMMENT ON COLUMN usuarios.identificacion IS 'Número de identificación del empleado. Obligatorio y único para RRHH/Auditoría.';
COMMENT ON COLUMN usuarios.email IS 'Correo electrónico para acceso al sistema. Debe ser único.';
COMMENT ON COLUMN usuarios.password_hash IS 'Contraseña encriptada (hash) del usuario.';
COMMENT ON COLUMN usuarios.creado_en IS 'Fecha y hora de registro del usuario (con zona horaria).';


-- =============================================================================
-- TABLA: usuario_roles
-- Descripción: Tabla intermedia que resuelve la relación N:M entre usuarios y roles.
-- =============================================================================

CREATE TABLE usuario_roles (
    id_usuario BIGINT          NOT NULL,
    id_rol     BIGINT          NOT NULL,
    creado_en  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_usuario_roles PRIMARY KEY (id_usuario, id_rol),
    CONSTRAINT fk_ur_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_ur_rol FOREIGN KEY (id_rol) REFERENCES roles (id_rol) ON UPDATE CASCADE ON DELETE CASCADE
);

COMMENT ON TABLE usuario_roles IS 'Asignación de roles a usuarios. Relación N:M.';
COMMENT ON COLUMN usuario_roles.id_usuario IS 'Referencia al usuario.';
COMMENT ON COLUMN usuario_roles.id_rol IS 'Referencia al rol asignado.';
COMMENT ON COLUMN usuario_roles.creado_en IS 'Fecha y hora de asignación del rol.';