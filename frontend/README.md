# Frontend SGTRA

Interfaz React/Vite para el Sistema de Gestión de Taller de Refrigeración Automotriz. Es una demostración académica: la interfaz representa los flujos del SRS, pero el backend local aún no publica sus endpoints funcionales.

## Ejecutar

```bash
npm install
npm run dev
```

Comandos de calidad:

```bash
npm run lint
npm run test
npm run build
```

## Modo de datos

El archivo `.env` puede contener:

```env
VITE_DATA_SOURCE=mock
VITE_API_BASE_URL=http://localhost:3000
```

`mock` es el valor predeterminado y no guarda datos fuera de la sesión actual. `api` hace que los servicios consulten `VITE_API_BASE_URL`; solo debe activarse cuando backend implemente el contrato documentado en `docs/presentacion-frontend.md`.

## Estructura

```text
src/
├─ pages/public/       sitio del cliente
├─ pages/admin/        módulos internos
├─ components/ui/      controles reutilizables
├─ components/common/  tabla, panel, encabezados y estados
├─ components/domain/  componentes de negocio
├─ data/mocks/         datos demostrativos aislados
├─ services/           puente mock/API por dominio
├─ constants/          rutas, estados y permisos demo
└─ utils/              validación y formato
```

## Recorrido de datos

```text
Pantalla React → service del dominio → mock local o API → controlador backend → PostgreSQL
```

Las pantallas no consultan SQL ni conocen tablas. Los servicios traducen respuestas de API a datos de interfaz y los estados se mantienen como códigos técnicos (`CONFIRMADA`, `PAGADA`, `EN_DIAGNOSTICO`) con etiquetas legibles para el usuario.

## Límites explícitos de la demo

- El login, permisos, agenda, consumo y pagos se simulan en memoria o `sessionStorage`.
- WhatsApp, sucursales, técnicos, importes e indicadores son datos demostrativos.
- El backend debe validar identidad, permisos, stock, diagnóstico, factura pagada y cierre de OT; el frontend solo previene errores fáciles de entender.
