# SGML Frontend

Interfaz web ligera para el Sistema de Gestión de Mantenimiento Locativo (SGML) de la Universidad Surcolombiana.

## Características

- Tema visual inspirado en la identidad institucional (verde y rojo USCO).
- Vistas separadas para login, dashboard y gestión de tickets.
- Consumo de la API del backend (ver carpeta `../backend`).
- Autenticación por cabecera `x-auth-token` usando almacenamiento local.
- Componentes reutilizables (tabla de tickets, timeline preventivo, KPI).
- Modo oscuro/claro persistente.

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox, Safari).
- Backend levantado (por defecto `http://localhost:3000`).

## Cómo usar

1. Inicia el backend siguiendo las instrucciones en `../backend/README.md`.
2. Abre `frontend/login.html` en tu navegador (doble clic o a través de un servidor estático si prefieres).
3. Ingresa con alguno de los usuarios demo:
   - Oficina: `oficina@usco.edu.co` / `Oficina123*`
   - Programador: `programador@usco.edu.co` / `Programador123*`
   - Operario: `operario.ac@usco.edu.co` / `Operario123*`
4. En el primer inicio puedes definir la URL del backend.

## Estructura

```
frontend/
├─ assets/
│  ├─ css/styles.css   # Estilos globales
│  └─ js/              # Módulos ES para API, autenticación y UI
├─ index.html          # Dashboard ejecutivo
├─ tickets.html        # Gestión y registro de tickets
└─ login.html          # Acceso por roles
```

Puedes extender este frontend con frameworks como React o Vue. Al mantener módulos ES separados, es sencillo migrar la lógica actual a componentes.

## Despliegue en Vercel

El frontend es un sitio estático, por lo que Vercel lo puede servir directamente. El archivo `vercel.json` ya mapea rutas amigables.

1. **Nuevo proyecto**
   - En Vercel selecciona **New Project** y elige este repositorio.
   - Establece la carpeta raíz en `frontend`.

2. **Configuración**
   - Framework preset: **Other**.
   - Build command: *(vacío)*.
   - Output directory: `.` (directorio actual).
   - Habilita la opción **Clean URLs** si te lo solicita (el `vercel.json` ya lo define).

3. **Variables de entorno**
   - Define `VITE_API_URL` o similar si en el futuro migras a bundlers. Hoy puedes editar `assets/js/api.js` para ajustar la URL del backend
     desplegado (ej. `https://sgml-backend.vercel.app`).

4. **Deploy y pruebas**
   - Una vez completado el despliegue visita `https://<tu-frontend>.vercel.app/login` e inicia sesión con los usuarios demo.
   - Verifica que el archivo `assets/js/api.js` apunte al dominio del backend en Vercel para evitar CORS.

5. **Vista previa local con Vercel CLI (opcional)**
   - Desde `frontend/` ejecuta `vercel dev` para obtener un servidor estático con las mismas rutas que en producción.
