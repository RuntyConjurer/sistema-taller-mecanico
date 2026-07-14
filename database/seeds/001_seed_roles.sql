-- =========================================================
-- Datos iniciales para roles
-- =========================================================

INSERT INTO roles (nombre, descripcion, activo)
VALUES
    ('ADMINISTRADOR', 'Acceso total al sistema', TRUE),
    ('RECEPCIONISTA', 'Gestiona citas, clientes y órdenes', TRUE),
    ('TECNICO', 'Realiza diagnósticos y servicios técnicos', TRUE),
    ('CAJERO', 'Gestiona facturación y pagos', TRUE),
    ('ENCARGADO_INVENTARIO', 'Controla materiales y refrigerantes', TRUE)
ON CONFLICT (nombre) DO NOTHING;