# Contrato de integración SGTRA

## Flujo de una solicitud

```text
Pantalla React → service del dominio → /api/v1 → controller → use case
               → repository → Sequelize → PostgreSQL
```

Las pantallas no conocen tablas ni construyen SQL. Los servicios centralizan URL, token y normalización de errores. En desarrollo, `VITE_API_BASE_URL` queda vacío y Vite dirige `/api` a Express en el puerto `3100`.

## Convenciones HTTP

- Base: `/api/v1`.
- Éxito: `{ "data": objetoOLista }`.
- Error: `{ "error": { "code", "message", "fieldErrors" } }`.
- Fechas: ISO-8601 con zona; valores monetarios e IDs: números.
- Autenticación: `Authorization: Bearer <token>`.
- La API devuelve `camelCase`; los mappers aíslan el `snake_case` de PostgreSQL.
- Nunca se devuelve `password_hash`.

## Endpoints públicos

| Método | Ruta | Uso |
| --- | --- | --- |
| GET | `/health` y `/ready` | Proceso y conexión a PostgreSQL |
| POST | `/sesiones` | Autenticar y obtener JWT |
| GET | `/servicios` | Catálogo público |
| GET | `/sucursales` | Sedes activas |
| POST | `/solicitudes-cita` | Crear cliente, vehículo y cita en una transacción |

## Endpoints protegidos

- `/clientes`, `/vehiculos`, `/citas`, `/servicios`, `/materiales` y `/usuarios`: mantenimiento y consulta.
- `/cotizaciones`: detalle, estados y conversión de una aprobada a OT.
- `/citas/:id/orden`: conversión de una cita a OT, sin duplicados.
- `/cotizaciones/:id/orden`: conversión de una cotización aprobada a OT.
- `/ordenes-trabajo/:id/diagnostico`: diagnóstico 1:1 mediante upsert.
- `/ordenes-trabajo/:id/materiales`: consumo; PostgreSQL valida y descuenta stock.
- `/facturas` y `/facturas/:id/pagos`: emisión, aplicación de pago y balance.
- `/ordenes-trabajo/:id/cerrar`: cierre sujeto a diagnóstico y factura pagada.
- `/vehiculos/:id/historial`, `/dashboard`, `/reportes/ingresos` y `/reportes/ordenes`: consulta operativa.

## Roles

| Rol | Operación principal |
| --- | --- |
| `RECEPCIONISTA` | Clientes, vehículos, citas, cotizaciones y apertura de OT |
| `TECNICO` | OT, diagnóstico, materiales e historial |
| `CAJERO` | Facturas y pagos |
| `ADMINISTRADOR` | Acceso completo y todas las sucursales |

La navegación del frontend es una ayuda visual; la seguridad real se aplica en cada endpoint.

## Errores de PostgreSQL

| SQLSTATE | HTTP | Código de API |
| --- | --- | --- |
| `23505` | 409 | `DUPLICATE_VALUE` |
| `23503` | 409 | `RELATED_RECORD` |
| `23502` | 422 | `REQUIRED_VALUE` |
| `23514` | 422 | `INVALID_VALUE` |
| `P0001` | 409 | `WORK_ORDER_DIAGNOSIS_REQUIRED` |
| `P0002` | 409 | `WORK_ORDER_PAYMENT_REQUIRED` |
| `P0003` | 409 | `MATERIAL_NOT_FOUND` |
| `P0004` | 409 | `INSUFFICIENT_STOCK` |

Los errores de formularios pueden incluir `fieldErrors`. Ante un error, el frontend conserva los datos para permitir la corrección.
