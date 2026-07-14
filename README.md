# SGTRA - Sistema de Gestión de Taller de Refrigeración Automotriz

Aplicación académica para administrar el flujo completo de un taller HVAC automotriz: cliente, vehículo, cita, cotización, orden de trabajo, diagnóstico, consumo de materiales, factura, pago e historial técnico.

## Ejecutar el sistema completo

Requisitos: Docker Desktop con Docker Compose.

```powershell
Copy-Item .env.example .env
docker compose up --build
```

Abra [http://localhost:8080](http://localhost:8080). Nginx es el único punto público: sirve React y redirige `/api/v1/*` al backend. PostgreSQL y Node.js permanecen en la red interna de Docker.

Para detener el sistema:

```powershell
docker compose down
```

La base se inicializa solo cuando el volumen está vacío. Para reconstruir todos los datos de demostración desde cero, elimine también el volumen (esta acción borra la base local):

```powershell
docker compose down -v
docker compose up --build
```

## Cuentas de demostración

Todas usan la contraseña `password123`.

| Rol | Correo |
| --- | --- |
| Administrador | `admin@sgtra.demo` |
| Recepcionista | `recepcion@sgtra.demo` |
| Técnico | `tecnico@sgtra.demo` |
| Cajero | `caja@sgtra.demo` |

Estas credenciales son exclusivas de la presentación. Cambie `POSTGRES_PASSWORD` y `JWT_SECRET` en entornos compartidos.

## Arquitectura

```text
Navegador
   │
   ▼
Nginx :8080 ── / ───────► React estático
   │
   └────────── /api/v1 ─► Express
                               │
                               ▼
                     Use cases y repositories
                               │
                               ▼
                         PostgreSQL 16
```

El backend mantiene una estructura deliberadamente sencilla:

```text
Route → Controller → UseCase → Repository → Sequelize → PostgreSQL
```

- `frontend/`: sitio público y panel del personal.
- `backend/`: API, autenticación, reglas de aplicación y acceso a datos.
- `database/migrations/`: esquema y reglas de integridad en orden numérico.
- `database/views/`: consultas consolidadas para operación y reportes.
- `database/seeds/`: datos académicos reproducibles.
- `docker/`: imágenes, proxy Nginx e inicialización de PostgreSQL.

## Variables principales

Copie `.env.example` como `.env`. `APP_PORT` cambia el puerto público y las variables `POSTGRES_*` configuran la base. `JWT_SECRET` firma las sesiones de ocho horas. El frontend compilado usa la API del mismo origen, por lo que no necesita conocer un puerto interno.

## Comprobaciones

```powershell
npm --prefix backend test
npm --prefix backend run smoke
npm --prefix frontend run lint
npm --prefix frontend test
npm --prefix frontend run build
docker compose config --quiet
```

`smoke` ejecuta el recorrido completo contra `http://127.0.0.1:8080/api/v1` y agrega datos de prueba. Use `SMOKE_BASE_URL` si Nginx está publicado en otro puerto.

Con el stack activo, las reglas críticas de PostgreSQL se prueban sin conservar datos:

```powershell
Get-Content -Raw database/tests/001_reglas_negocio.sql |
  docker compose exec -T db sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

El recorrido esperado es:

```text
Agenda → Cita → OT → Diagnóstico → Consumo → Factura → Pago → Cierre → Historial
```

PostgreSQL impide cerrar una OT sin diagnóstico o factura pagada y evita consumos superiores al stock. El frontend orienta al usuario; la API coordina transacciones; la base impone la integridad.

## Documentación

- [Arquitectura y trazabilidad del SRS](docs/arquitectura-srs.md)
- [Contrato e integración](docs/integracion-backend.md)
- [Guion de presentación](docs/presentacion-frontend.md)

WhatsApp Business y facturación electrónica son integraciones opcionales del SRS y no forman parte de esta entrega.
