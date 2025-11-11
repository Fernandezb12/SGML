# 🌐 SGML Frontend  
**Interfaz web ligera del Sistema de Gestión de Mantenimiento Locativo (SGML)**  
📍 *Universidad Surcolombiana — USCO*

---

## 🏫 Descripción General  
El **SGML Frontend** es una interfaz web diseñada para la gestión eficiente de requerimientos de mantenimiento locativo dentro de la Universidad Surcolombiana.  
Permite a distintos roles (Oficina, Jefe Programador y Operario) registrar, asignar y ejecutar órdenes de trabajo (OT) de tipo **correctivo** o **preventivo**, integrándose con el **backend institucional**.

---

## 🎨 Características Principales  

✅ **Tema visual institucional**  
> Inspirado en los colores de la USCO (verde y rojo).  

✅ **Interfaz modular y responsiva**  
> Adaptable tanto a escritorio como dispositivos móviles.  

✅ **Autenticación segura**  
> Usa cabecera `x-auth-token` con almacenamiento local persistente.  

✅ **Componentes reutilizables:**  
- Tabla de tickets activos  
- Línea de tiempo de mantenimiento preventivo  
- Indicadores KPI de desempeño  

✅ **Modo oscuro y claro** persistente en todas las vistas.  

✅ **Integración directa con la API backend** (`../backend`).  

✅ **Gestión multirol:**  
- 🏢 Oficina de Mantenimiento  
- 🧭 Jefe Programador  
- 🧰 Operario  

---

## ⚙️ Requisitos  

- 🌐 Navegador moderno: Chrome, Edge, Firefox o Safari.  
- 🔧 Backend en ejecución (por defecto en `http://localhost:3000`).  
- 💻 Conexión local o en red institucional.

---

## 🚀 Cómo Usar  

1. **Inicia el backend** siguiendo las instrucciones del archivo [`../backend/README.md`](../backend/README.md).  
2. **Abre** `frontend/login.html` en tu navegador (doble clic o mediante un servidor estático como *Live Server*).  
3. **Inicia sesión** con alguno de los usuarios demo:  

| Rol | Usuario | Contraseña |
|-----|----------|-------------|
| 🏢 Oficina | oficina@usco.edu.co | Oficina123* |
| 🧭 Programador | programador@usco.edu.co | Programador123* |
| 🧰 Operario | operario.ac@usco.edu.co | Operario123* |

4. En el primer ingreso, define la **URL del backend**.  
5. ¡Listo! Ya puedes crear, consultar o cerrar tickets.

---

## 🗂️ Estructura del Proyecto  

```bash
frontend/
├─ assets/
│  ├─ css/
│  │   └─ styles.css       # Estilos globales y paleta USCO
│  └─ js/
│      ├─ api.js           # Consumo de endpoints del backend
│      ├─ auth.js          # Módulo de autenticación y sesión
│      └─ ui.js            # Comportamiento dinámico de la interfaz
│
├─ index.html              # Dashboard ejecutivo con KPIs
├─ tickets.html            # Gestión, creación y seguimiento de tickets
└─ login.html              # Acceso por roles

🧠 Extensibilidad

El frontend puede ampliarse fácilmente para:

Implementar notificaciones en tiempo real mediante WebSockets.

Integrar un sistema de roles ampliado (administrador, interventor, etc.).

Conectar con servicios externos de monitoreo de infraestructura.

Gracias a su estructura modular, cada componente puede convertirse en un web component o un componente React/Vue sin alterar la lógica principal.

📈 Diagramas de Flujo del Sistema SGML

A continuación, se presentan los procesos principales que se ejecutan desde el frontend y se comunican con el backend:

🧾 Solicitante → Registro del requerimiento en la app.

🏢 Oficina de Mantenimiento → Clasificación, validación y priorización del ticket.

🧭 Jefe Programador → Asignación de OT correctiva o preventiva.

🧰 Operario → Ejecución del mantenimiento, diligenciamiento del checklist y confirmación en la app.

🖼️ Diagramas Visuales
1️⃣ Solicitante
<p align="center"> <img src="file:///C:/iman/Diagrama%20sin%20t%C3%ADtulo.drawio%20(4).png" width="650"><br> <em>Registro de requerimiento y validación de solución por parte del solicitante.</em> </p>
2️⃣ Oficina de Mantenimiento
<p align="center"> <img src="file:///C:/iman/WhatsApp%20Image%202025-11-11%20at%2014.00.05.jpeg" width="750"><br> <em>Clasificación del ticket, asignación de prioridad y envío al programador.</em> </p>
3️⃣ Jefe Programador
<p align="center"> <img src="file:///C:/iman/Diagrama%20sin%20t%C3%ADtulo.drawio%20(6).png" width="750"><br> <em>Planificación, selección de operario y creación de OT correctiva o preventiva.</em> </p>
4️⃣ Operario
<p align="center"> <img src="file:///C:/iman/Diagrama%20sin%20t%C3%ADtulo.drawio%20(7).png" width="600"><br> <em>Ejecución del mantenimiento, diligenciamiento del checklist y reporte final.</em> </p>

🏁 Créditos

Desarrollado por:
Estudiantes de Ingeniería de Software — Universidad Surcolombiana (USCO)
📅 Año: 2025
🧩 Proyecto académico SGML
