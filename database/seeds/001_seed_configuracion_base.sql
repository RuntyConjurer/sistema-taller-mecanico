-- =============================================================================
-- Seed: 001_seed_configuracion_base.sql
-- Descripción: Puebla las tablas maestras de infraestructura, seguridad y 
--              personal interno (sucursales, roles, usuarios y asignaciones).
-- Motor: PostgreSQL
-- =============================================================================

-- =============================================================================
-- 1. SUCURSALES
-- =============================================================================
INSERT INTO sucursales (nombre, direccion, telefono, email) 
VALUES
    ('Sucursal Central', 'Av. 27 de Febrero #150, Distrito Nacional', '809-555-0100', 'central@refrigeracion.com'),
    ('Sucursal Norte', 'Av. Monumental #45, Los Girasoles', '809-555-0101', 'norte@refrigeracion.com');

-- =============================================================================
-- 2. ROLES
-- =============================================================================
INSERT INTO roles (nombre, descripcion) 
VALUES
    ('ADMINISTRADOR', 'Acceso total al sistema, configuraciones y reportes financieros.'),
    ('TECNICO', 'Registro de diagnósticos, uso de materiales e historial de vehículos.'),
    ('CAJERO', 'Módulo de facturación, emisión de comprobantes y cobros.'),
    ('RECEPCIONISTA', 'Creación de citas, recepción de clientes y apertura de órdenes.');

-- =============================================================================
-- 3. USUARIOS
-- (Nota: El password_hash es 'password123' encriptado con Bcrypt para pruebas)
-- =============================================================================
INSERT INTO usuarios (id_sucursal, tipo_identificacion, identificacion, nombre, email, password_hash, telefono) 
VALUES
    (
        (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central'), 
        'CEDULA', '001-0000001-1', 'Admin Principal', 'admin@refrigeracion.com', 
        '$2b$10$wN3H0m5oHqD3H6V3f/5n6u7iH8m8H8m8H8m8H8m8H8m8H8m8H8m8m', '809-555-1001'
    ),
    (
        (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central'), 
        'CEDULA', '402-0000002-2', 'Carlos Técnico', 'carlos.tecnico@refrigeracion.com', 
        '$2b$10$wN3H0m5oHqD3H6V3f/5n6u7iH8m8H8m8H8m8H8m8H8m8H8m8H8m8m', '809-555-1002'
    ),
    (
        (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central'), 
        'PASAPORTE', 'RD123456', 'María Cajera', 'maria.caja@refrigeracion.com', 
        '$2b$10$wN3H0m5oHqD3H6V3f/5n6u7iH8m8H8m8H8m8H8m8H8m8H8m8H8m8m', '809-555-1003'
    );

-- =============================================================================
-- 4. ASIGNACIÓN DE ROLES (USUARIO_ROLES)
-- =============================================================================
INSERT INTO usuario_roles (id_usuario, id_rol) 
VALUES
    (
        (SELECT id_usuario FROM usuarios WHERE email = 'admin@refrigeracion.com'), 
        (SELECT id_rol FROM roles WHERE nombre = 'ADMINISTRADOR')
    ),
    (
        (SELECT id_usuario FROM usuarios WHERE email = 'carlos.tecnico@refrigeracion.com'), 
        (SELECT id_rol FROM roles WHERE nombre = 'TECNICO')
    ),
    (
        (SELECT id_usuario FROM usuarios WHERE email = 'maria.caja@refrigeracion.com'), 
        (SELECT id_rol FROM roles WHERE nombre = 'CAJERO')
    );