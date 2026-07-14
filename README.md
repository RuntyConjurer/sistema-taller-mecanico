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

## Ejecutar sin Docker

Requisitos: Node.js 20.19 o superior y PostgreSQL 16. Cree una base vacía y un usuario desde pgAdmin o `psql`:

```sql
CREATE ROLE sgtra LOGIN PASSWORD 'sgtra_local_password';
CREATE DATABASE sgtra OWNER sgtra;
```

Prepare los entornos e instale dependencias:

```powershell
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
npm --prefix backend ci
npm --prefix frontend ci
```

En `backend/.env`, ajuste `DATABASE_URL`. En `frontend/.env.local`, use:

```dotenv
VITE_DATA_SOURCE=api
VITE_API_BASE_URL=
VITE_DEV_API_URL=http://localhost:3000
```

Inicialice una base vacía y levante ambos procesos:

```powershell
npm --prefix backend run db:init
npm --prefix backend run dev
```

En otra terminal:

```powershell
npm --prefix frontend run dev
```

Abra [http://localhost:5173](http://localhost:5173). Vite redirige `/api` a Express en `3000`. El inicializador es multiplataforma y se detiene si detecta una base previamente creada; nunca elimina tablas ni datos.

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

Cada dominio operativo mantiene esas mismas cuatro piezas. No son aplicaciones separadas: comparten Express, la sesión y una sola conexión a PostgreSQL.

```text
backend/src/
├── routes/          URLs, autenticación y permisos
├── controllers/     Traducción entre HTTP y casos de uso
├── domain/          Validaciones y reglas de aplicación
├── repositories/    Consultas y transacciones Sequelize
├── infrastructure/  Modelos agrupados y conexión a PostgreSQL
└── di/              Construcción y conexión de dependencias
```

Los módulos principales son agenda/cotizaciones, órdenes de trabajo, inventario, facturación, reportes y WhatsApp. `routes/index.js` solo los registra; `di/container.js` solo conecta sus dependencias. Así se puede explicar o probar un flujo sin recorrer un archivo general de cientos de líneas.

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

Cada `push` y pull request hacia `main` o `development` ejecuta estas comprobaciones en GitHub Actions. El segundo job crea una base PostgreSQL vacía, construye API y frontend, levanta Nginx y recorre el flujo completo antes de aceptar la entrega.

## Documentación

- [Arquitectura y trazabilidad del SRS](docs/arquitectura-srs.md)
- [Contrato e integración](docs/integracion-backend.md)
- [Configuración de WhatsApp Cloud API](docs/integracion-whatsapp.md)
- [Guion de presentación](docs/presentacion-frontend.md)

WhatsApp Cloud API está integrada de forma opcional y permanece desactivada hasta configurar las credenciales privadas en `.env`. La facturación electrónica permanece fuera de esta entrega.
