-- Cuenta local de administración para desarrollo/presentación.
-- Contraseña: 1234

WITH usuario_admin AS (
  INSERT INTO usuarios (
    id_sucursal,
    tipo_identificacion,
    identificacion,
    nombre,
    email,
    password_hash,
    telefono,
    activo
  )
  VALUES (
    (SELECT id_sucursal FROM sucursales WHERE nombre = 'Sucursal Central' LIMIT 1),
    'PASAPORTE',
    'LOCALADMIN0001',
    'Administrador Local',
    'admin@admin.com',
    '$2b$10$wmc603icsXd22iPmrgUL9erl8RJnZ.CfvVvZf888Q7IVv2SspZ2PC',
    '809-555-1000',
    TRUE
  )
  ON CONFLICT (email) DO UPDATE
  SET
    password_hash = EXCLUDED.password_hash,
    activo = TRUE
  RETURNING id_usuario
)
INSERT INTO usuario_roles (id_usuario, id_rol)
SELECT usuario_admin.id_usuario, roles.id_rol
FROM usuario_admin
CROSS JOIN roles
WHERE roles.nombre = 'ADMINISTRADOR'
ON CONFLICT (id_usuario, id_rol) DO NOTHING;
