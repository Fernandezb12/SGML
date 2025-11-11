# SGML Backend

API en Node.js + Express para el Sistema de Gestión de Mantenimiento Locativo (SGML) de la Universidad Surcolombiana.

## Tecnologías

- Node.js 18+
- Express
- CORS, Morgan
- Persistencia simple en archivos JSON (fs)

## Estructura

```
backend/
├─ package.json
├─ server.js
└─ src/
   ├─ app.js
   ├─ controllers/
   ├─ routes/
   ├─ middleware/
   ├─ utils/
   └─ models/ (json de ejemplo)
```

## Instalación

1. Instala dependencias:

   ```bash
   npm install
   ```

   > Si la descarga desde npm falla por políticas de red, instala manualmente los paquetes `express`, `cors`, `morgan`, `uuid` y `nodemon`.

2. Ejecuta en modo desarrollo:

   ```bash
   npm run dev
   ```

3. Producción/local simple:

   ```bash
   npm start
   ```

El servidor intenta usar `http://localhost:3000` por defecto. Si el puerto está ocupado, busca uno libre (3001, 3002, …) y lo indica en consola. También puedes fijar manualmente otro puerto ejecutando `PORT=4000 npm start`.

## Autenticación

- Header obligatorio: `x-auth-token`.
- Endpoint de login: `POST /api/auth/login` → responde con token y datos del usuario.
- Usuarios demo en `src/models/users.json`.

## Endpoints principales

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/api/auth/login` | POST | Autenticación por email/clave |
| `/api/auth/me` | GET | Perfil según token |
| `/api/catalogo` | GET | Catálogo completo (sedes, categorías, prioridades) |
| `/api/tickets` | GET/POST | Listado y creación de tickets |
| `/api/tickets/:id` | GET/PUT | Detalle y actualización general |
| `/api/tickets/:id/asignacion` | POST | Asignar operario y programador |
| `/api/tickets/:id/estado` | POST | Cambiar estado (respeta flujo y checklist) |
| `/api/tickets/:id/checklist` | POST | Agregar paso al checklist |
| `/api/tickets/:id/evidencias` | POST | Registrar evidencia |
| `/api/tickets/:id/insumos` | POST | Registrar insumo usado |
| `/api/estados/kpis` | GET | KPIs de ciclo de vida |
| `/api/asignaciones` | GET | Resumen por operario |
| `/api/reportes/operativo` | GET | Tickets por estado |
| `/api/reportes/backlog` | GET | Tickets con retraso |

## Estados permitidos

Flujo: `nuevo → en validacion → asignado → en ejecucion → en espera → solucionado → cerrado` (con opción de `reabierto`). Las transiciones inválidas responden con `409`.

Para cerrar un ticket es obligatorio:
- Checklist con todos los pasos en `completado: true`.
- Al menos una evidencia cargada.

## Datos de ejemplo

- `src/models/tickets.json`: tickets preventivos y correctivos con checklist e insumos.
- `src/models/catalog.json`: sedes, categorías, planes preventivos.
- `src/models/users.json`: usuarios demo para cada rol (solicitante, oficina, programador, operario, coordinador preventivo).

## Tests manuales sugeridos (via curl o Thunder Client)

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"oficina@usco.edu.co","password":"Oficina123*"}'

# Listar tickets
curl http://localhost:3000/api/tickets \
  -H "x-auth-token: <TOKEN>"

# Cambiar estado
curl -X POST http://localhost:3000/api/tickets/TCK-20241111-001/estado \
  -H "Content-Type: application/json" \
  -H "x-auth-token: <TOKEN>" \
  -d '{"estado":"en ejecucion"}'
```

## Próximos pasos recomendados

- Sustituir persistencia en archivos por PostgreSQL o MongoDB.
- Integrar notificaciones (correo o push) en cambios de estado.
- Añadir pruebas unitarias con Jest o Vitest.
- Desplegar en contenedores (Docker) y usar un CDN para el frontend.

## Despliegue en Vercel

La API funciona en Vercel como una Function Serverless reutilizando el mismo código de Express. El repositorio ya incluye la
carpeta `api/` y el archivo `vercel.json` necesarios.

1. **Crear el proyecto**
   - En Vercel haz clic en **New Project** y selecciona este repositorio.
   - Cuando te pregunte por la carpeta raíz indica `backend` (monorepo support).

2. **Configurar Build & Output**
   - Framework preset: **Other**.
   - Comando de instalación: `npm install`.
   - Comando de build: *(dejar vacío, no se compila)*.
   - Output directory: *(dejar vacío)*.

3. **Variables de entorno opcionales**
   - Si necesitas claves adicionales, agrégalas en la sección **Environment Variables**. El proyecto no requiere ninguna para
     funcionar con los datos mock.

4. **Deploy**
   - Al terminar la importación, Vercel detectará `api/index.js` y expondrá toda la API bajo la misma URL (por ejemplo
     `https://sgml-backend.vercel.app/api/tickets`).
   - Puedes probar rápidamente haciendo `curl https://<tu-dominio>/api/catalogo`.

5. **Uso local con Vercel CLI (opcional)**
   - Instala la CLI: `npm i -g vercel`.
   - Desde `backend/` ejecuta `vercel dev` para emular las Functions con hot reload.
