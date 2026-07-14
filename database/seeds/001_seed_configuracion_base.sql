-- Configuración mínima para ejecutar y presentar SGTRA.
-- Todas las cuentas de demostración usan la contraseña: password123

INSERT INTO sucursales (nombre, direccion, telefono, email)
VALUES
    ('Sucursal Central', 'Av. 27 de Febrero #150, Distrito Nacional', '809-555-0100', 'central@sgtra.demo'),
    ('Sucursal Norte', 'Av. Monumental #45, Los Girasoles', '809-555-0101', 'norte@sgtra.demo');

INSERT INTO roles (nombre, descripcion)
VALUES
    ('ADMINISTRADOR', 'Acceso completo y consulta de todas las sucursales.'),
    ('RECEPCIONISTA', 'Gestiona clientes, vehículos, citas, cotizaciones y apertura de OT.'),
    ('TECNICO', 'Registra diagnósticos, servicios, materiales e historial técnico.'),
    ('CAJERO', 'Emite facturas y registra pagos.');

-- Hash bcrypt válido, costo 10. La contraseña es solo para el entorno académico.
INSERT INTO usuarios (
    id_sucursal,
    tipo_identificacion,
    identificacion,
    nombre,
    email,
    password_hash,
    telefono
)
VALUES
    (
        (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central'),
        'CEDULA', '001-0000001-1', 'Bari Báez', 'admin@sgtra.demo',
        '$2b$10$KjSduvugXvGdef37CFo.JeXHfXRsoQyY.W6JZlUWVTGcTQkmYN//y', '809-555-1001'
    ),
    (
        (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central'),
        'CEDULA', '001-0000002-2', 'Ángelo Recepción', 'recepcion@sgtra.demo',
        '$2b$10$KjSduvugXvGdef37CFo.JeXHfXRsoQyY.W6JZlUWVTGcTQkmYN//y', '809-555-1002'
    ),
    (
        (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central'),
        'CEDULA', '001-0000003-3', 'Carlos Técnico', 'tecnico@sgtra.demo',
        '$2b$10$KjSduvugXvGdef37CFo.JeXHfXRsoQyY.W6JZlUWVTGcTQkmYN//y', '809-555-1003'
    ),
    (
        (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central'),
        'PASAPORTE', 'RD000004', 'María Caja', 'caja@sgtra.demo',
        '$2b$10$KjSduvugXvGdef37CFo.JeXHfXRsoQyY.W6JZlUWVTGcTQkmYN//y', '809-555-1004'
    );

INSERT INTO usuario_roles (id_usuario, id_rol)
SELECT u.id_usuario, r.id_rol
FROM (
    VALUES
        ('admin@sgtra.demo', 'ADMINISTRADOR'),
        ('recepcion@sgtra.demo', 'RECEPCIONISTA'),
        ('tecnico@sgtra.demo', 'TECNICO'),
        ('caja@sgtra.demo', 'CAJERO')
) AS asignacion(email, rol)
INNER JOIN usuarios u ON u.email = asignacion.email
INNER JOIN roles r ON r.nombre = asignacion.rol;
