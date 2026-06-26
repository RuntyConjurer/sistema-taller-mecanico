-- =============================================================================
-- Seed: 003_seed_clientes_y_vehiculos.sql
-- Descripción: Puebla la base de datos con clientes de prueba (personas y 
--              empresas) y sus respectivos vehículos asociados.
-- Motor: PostgreSQL
-- =============================================================================

-- =============================================================================
-- 1. CLIENTES
-- =============================================================================
INSERT INTO clientes (
    tipo_cliente, 
    tipo_identificacion, 
    identificacion, 
    nombre, 
    telefono, 
    direccion, 
    email
)
VALUES
    (
        'PERSONA', 'CEDULA', '001-1234567-8', 
        'Juan Pérez', '809-555-2001', 
        'Ensanche Naco, Distrito Nacional', 'juan.perez@email.com'
    ),
    (
        'EMPRESA', 'RNC', '101123456', 
        'Transportes del Caribe SRL', '809-555-2002', 
        'Av. Luperón, Zona Industrial de Herrera', 'flota@transcaribe.com.do'
    ),
    (
        'PERSONA', 'PASAPORTE', 'PP1234567', 
        'Ana Gómez', '829-555-2003', 
        'Piantini, Distrito Nacional', 'ana.gomez@email.com'
    );

-- =============================================================================
-- 2. VEHÍCULOS
-- =============================================================================
INSERT INTO vehiculos (
    id_cliente, 
    chasis, 
    marca, 
    modelo, 
    placa, 
    color, 
    anio, 
    tipo_refrigerante
)
VALUES
    -- Vehículo de Juan Pérez
    (
        (SELECT id_cliente FROM clientes WHERE identificacion = '001-1234567-8'),
        'JTDBR32E100000001', 'Toyota', 'Corolla', 'A000001', 'Gris Plata', 2015, 'R-134a'
    ),
    
    -- Flota de Transportes del Caribe SRL (Vehículo 1)
    (
        (SELECT id_cliente FROM clientes WHERE identificacion = '101123456'),
        '3N6CD38T000000002', 'Nissan', 'Frontier', 'L000001', 'Blanco', 2021, 'R-1234yf'
    ),
    
    -- Flota de Transportes del Caribe SRL (Vehículo 2)
    (
        (SELECT id_cliente FROM clientes WHERE identificacion = '101123456'),
        '3N6CD38T000000003', 'Nissan', 'Frontier', 'L000002', 'Blanco', 2021, 'R-1234yf'
    ),
    
    -- Vehículo de Ana Gómez
    (
        (SELECT id_cliente FROM clientes WHERE identificacion = 'PP1234567'),
        'JHLRD785000000004', 'Honda', 'CR-V', 'G000001', 'Rojo', 2018, 'R-134a'
    );