# Arquitectura y trazabilidad del SRS

## Responsabilidad de cada capa

| Capa | Responsabilidad | No debe hacer |
| --- | --- | --- |
| React | Formularios, navegación, accesibilidad y mensajes | Consultar PostgreSQL directamente |
| Nginx | Servir el build y enrutar `/api/` | Implementar reglas del taller |
| Route/Controller | Interpretar HTTP y construir la respuesta | Escribir consultas SQL |
| UseCase | Coordinar reglas, permisos y transacciones | Conocer detalles visuales |
| Repository/Sequelize | Consultar y persistir entidades | Decidir permisos de usuario |
| PostgreSQL | Relaciones, stock, cierre y consistencia | Formatear respuestas para React |

La API responde `{ "data": ... }` en éxito y `{ "error": { "code", "message", "fieldErrors" } }` en error. El JSON usa `camelCase`; las columnas conservan `snake_case`.

## Trazabilidad funcional

| SRS | Módulo | Endpoint principal | Tablas o vistas |
| --- | --- | --- | --- |
| RF-01 Clientes | Clientes | `/api/v1/clientes` | `clientes` |
| RF-02 Vehículos | Vehículos | `/api/v1/vehiculos` | `vehiculos` |
| RF-03 OT | Órdenes | `/api/v1/ordenes-trabajo` | `ordenes_trabajo`, `vw_ordenes_trabajo_resumen` |
| RF-04 Diagnóstico | Diagnósticos | `/api/v1/ordenes-trabajo/:id/diagnostico` | `diagnosticos` |
| RF-05 Servicios | Servicios | `/api/v1/servicios` | `servicios`, `orden_trabajo_servicios` |
| RF-06 Inventario | Inventario | `/api/v1/materiales` | `materiales`, `inventario_movimientos` |
| RF-07 Refrigerantes | Recargas | `/api/v1/ordenes-trabajo/:id/materiales` | `materiales`, `orden_trabajo_materiales` |
| RF-08 Facturación | Facturas y pagos | `/api/v1/facturas` | `facturas`, `factura_detalles`, `pagos` |
| RF-09 Citas | Agenda y citas | `/api/v1/solicitudes-cita` | `citas` |
| RF-10 Usuarios | Sesión y usuarios | `/api/v1/sesiones` | `usuarios`, `roles`, `usuario_roles` |
| RF-11 Historial | Historial por vehículo | `/api/v1/vehiculos/:id/historial` | `historial_tecnico`, `vw_historial_clinico_vehiculo` |
| RF-12 Reportes | Dashboard y reportes | `/api/v1/dashboard`, `/api/v1/reportes/ingresos` | vistas `vw_*` y consultas agregadas |
| Función principal: Cotizaciones | Cotizaciones | `/api/v1/cotizaciones` | `cotizaciones`, `cotizacion_detalles` |

## Reglas y autoridad

- `P0001`: el trigger rechaza el cierre sin diagnóstico.
- `P0002`: el trigger rechaza el cierre sin factura pagada.
- `P0003`: el material solicitado no existe.
- `P0004`: el trigger bloquea el consumo sin stock suficiente.
- La clave foránea de `vehiculos.id_cliente` exige propietario registrado.
- Los índices únicos parciales evitan crear dos OT desde una cita o cotización.
- El backend calcula facturas, rechaza sobrepagos y ejecuta los flujos compuestos en transacciones.
- Los usuarios no administradores quedan limitados a su sucursal; el inventario es compartido por decisión académica.

## Requisitos no funcionales

- Contraseñas: hashes bcrypt, nunca incluidos en respuestas.
- Rendimiento: índices para filtros frecuentes y objetivo de respuesta menor a tres segundos en datos seed.
- Navegadores: build moderno de React/Vite servido por Nginx.
- Disponibilidad: healthchecks y reinicio automático mejoran recuperación; no prueban por sí solos un 99% estadístico.
- Multi-sucursal: usuarios, citas, OT, dashboard y reportes se filtran por sede.

## Límites declarados

Los datos seed y las cuentas son demostrativos. WhatsApp Business y facturación electrónica son opciones de puntuación adicional, no requisitos obligatorios, y permanecen fuera de esta versión.
