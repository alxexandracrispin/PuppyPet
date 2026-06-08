# PuppyPet - Aplicación Web con MVC, React y Generación XML

## Descripción del proyecto

PuppyPet es una aplicación web desarrollada como proyecto académico. Originalmente el sistema estaba construido como un sitio HTML estático, pero fue migrado a una aplicación web funcional con frontend, backend, base de datos y generación de XML.

El proyecto simula un punto de venta para una tienda de mascotas. El objetivo principal no es solo mostrar productos, sino representar el flujo completo de una venta:

```txt
Catálogo → Carrito → Confirmar venta → Registrar venta → Generar XML
```

La aplicación permite visualizar productos por categoría, agregarlos al carrito, confirmar una venta como usuario registrado o invitado, generar un XML de boleta y consultar el historial de compras.

---

## Tecnologías utilizadas

### Frontend

| Tecnología | Versión |
|---|---|
| React | 19 |
| React Router DOM | v6 |
| React Bootstrap | 5 |
| Bootstrap | 5 |
| Axios | latest |
| React Icons | latest |

### Backend

| Tecnología | Versión |
|---|---|
| Node.js | 18+ |
| Express | 4 |
| SQLite3 | latest |
| bcryptjs | latest |
| Arquitectura | MVC |

---

## Estructura general del proyecto

```txt
PuppyPet/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── categoriaController.js
│   │   │   ├── inventarioController.js
│   │   │   ├── productoController.js
│   │   │   ├── usuarioController.js
│   │   │   └── ventaController.js
│   │   ├── database/
│   │   │   ├── initDb.js
│   │   │   ├── migrateAdminBi.js
│   │   │   ├── schema.sql
│   │   │   └── seed.sql
│   │   ├── models/
│   │   │   ├── adminModel.js
│   │   │   ├── categoriaModel.js
│   │   │   ├── documentoXmlModel.js
│   │   │   ├── inventarioModel.js
│   │   │   ├── productoModel.js
│   │   │   ├── usuarioModel.js
│   │   │   └── ventaModel.js
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── categoriaRoutes.js
│   │   │   ├── inventarioRoutes.js
│   │   │   ├── productoRoutes.js
│   │   │   ├── usuarioRoutes.js
│   │   │   └── ventaRoutes.js
│   │   ├── services/
│   │   │   └── generadorXmlService.js
│   │   └── app.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── images/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── inventario/
│   │   │   │   └── AdminInventario.js
│   │   │   ├── AdminDashboard.js
│   │   │   └── AdminUsuarios.js
│   │   ├── api/
│   │   │   └── api.js
│   │   ├── components/
│   │   │   ├── BoletaTicket.js
│   │   │   ├── Footer.js
│   │   │   ├── Layout.js
│   │   │   ├── NavbarPrincipal.js
│   │   │   └── ProductoCard.js
│   │   ├── pages/
│   │   │   ├── Carrito.js
│   │   │   ├── Catalogo.js
│   │   │   ├── Contacto.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── MiPerfil.js
│   │   │   ├── MisCompras.js
│   │   │   ├── Nosotros.js
│   │   │   ├── ProductoDetalle.js
│   │   │   ├── Registro.js
│   │   │   └── VentaConfirmada.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

---

## Arquitectura del backend

El backend utiliza una estructura basada en MVC:

```txt
models       → Consultas y operaciones con la base de datos
controllers  → Lógica de respuesta para las solicitudes HTTP
routes       → Definición de endpoints de la API
services     → Funciones de apoyo, como generación de XML
database     → Scripts SQL e inicialización de SQLite
```

---

## Funcionalidades principales

### Catálogo y carrito
- Catálogo dinámico de productos con filtro por categoría.
- Carrito de compras persistido en `localStorage`.
- Cálculo automático de neto, IVA (19%) y total.
- Límite de cantidad por stock disponible.

### Ventas
- Confirmación de venta como usuario registrado o invitado.
- Registro de venta y detalle en base de datos.
- Descuento automático de stock al confirmar.
- Generación de XML de boleta electrónica (simulación académica SII).
- Visualización del XML generado en nueva pestaña.

### Sistema de usuarios
- Registro con validación de RUT chileno (algoritmo módulo 11).
- Política de contraseña segura: mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
- Contraseñas encriptadas con **bcryptjs** (hash irreversible, nunca se almacena en texto plano).
- Login y cierre de sesión con persistencia en `localStorage`.
- Perfil editable: datos personales y cambio de contraseña.
- Historial de compras del usuario autenticado.
- Ventas de invitados emitidas con RUT consumidor final (66.666.666-6).

### Panel de administración
- Protegido por guard de rol `ADMIN`.
- Acceso desde la Navbar solo si el usuario tiene rol ADMIN.

#### Dashboard BI
- KPIs: total vendido, cantidad de ventas, productos vendidos, ticket promedio.
- Gráficos de barras: productos más vendidos, ventas por mes, ventas por categoría, registrado vs. invitado.
- Alerta de stock crítico con acceso directo al módulo de inventario.
- Basado en esquema estrella (ver sección más abajo).

#### Gestión de inventario
- Tabla de productos con semáforo de stock: 🔴 crítico / 🟡 alerta / 🟢 ideal.
- Registro de movimientos ENTRADA y SALIDA con motivo y observación.
- Historial completo de movimientos con trazabilidad.
- Edición de umbrales del semáforo por producto.
- Filtro por estado de stock.

#### Gestión de usuarios
- Tabla de todos los usuarios registrados.
- Cambio de rol (CLIENTE ↔ ADMIN) desde selector directo en tabla.
- Activar / desactivar usuario (ACTIVO ↔ INACTIVO) con toggle.

---

## Esquema estrella BI

Para los reportes del dashboard, el sistema utiliza un esquema estrella simple:

```txt
hecho_venta          → tabla de hechos: id_venta, total, cantidad, fecha
dim_tiempo           → año, mes, trimestre, día de semana
dim_producto         → nombre del producto
dim_categoria        → nombre de la categoría
dim_cliente_tipo     → REGISTRADO o INVITADO
```

Las dimensiones se poblan automáticamente con `INSERT OR IGNORE` al confirmar cada venta. La migración inicial se ejecuta con `migrateAdminBi.js`.

---

## Categorías disponibles

- Perros
- Gatos
- Snack
- Accesorios
- Higiene
- Juguetes

---

## Instalación y ejecución

El proyecto se divide en dos partes:

```txt
backend  → API, base de datos y generación XML
frontend → Interfaz React
```

Deben ejecutarse en terminales separadas.

---

### 1. Ejecutar backend

Abrir una terminal en la raíz del proyecto y entrar a la carpeta backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Inicializar la base de datos SQLite:

```bash
npm run init-db
```

Levantar el servidor backend:

```bash
npm run dev
```

El backend quedará disponible en:

```txt
http://localhost:3001
```

Para validar que funciona:

```txt
http://localhost:3001/api/productos
```

---

### 2. Ejecutar frontend

Abrir una segunda terminal en la raíz del proyecto y entrar a la carpeta frontend:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Levantar la aplicación React:

```bash
npm start
```

El frontend quedará disponible en:

```txt
http://localhost:3000
```

---

## Flujo de prueba recomendado

### Cliente
1. Abrir `http://localhost:3000`.
2. Registrarse como nuevo usuario.
3. Iniciar sesión.
4. Entrar al catálogo y filtrar por categoría.
5. Agregar productos al carrito.
6. Ir al carrito y confirmar la venta.
7. Revisar la pantalla de venta confirmada y abrir el XML.
8. Ir a "Mis Compras" para ver el historial.

### Administrador
1. Iniciar sesión con un usuario de rol ADMIN.
2. Acceder al panel desde el link ADMIN en la Navbar.
3. Revisar el Dashboard BI con KPIs y gráficos.
4. Ir a Inventario para registrar movimientos de stock.
5. Ir a Usuarios para cambiar roles o desactivar cuentas.

---

## Endpoints principales

### Usuarios

```txt
GET    /api/usuarios
GET    /api/usuarios/:id
POST   /api/usuarios/registro
POST   /api/usuarios/login
PUT    /api/usuarios/:id
PUT    /api/usuarios/:id/password
PUT    /api/usuarios/:id/rol
PUT    /api/usuarios/:id/estado
```

### Productos

```txt
GET /api/productos
GET /api/productos/:id
GET /api/productos?categoria=Perros
```

### Categorías

```txt
GET /api/categorias
```

### Ventas

```txt
POST /api/ventas/confirmar-directa
GET  /api/ventas/:idVenta
GET  /api/ventas/:idVenta/xml
GET  /api/ventas/usuario/:idUsuario
```

### Admin — Dashboard BI

```txt
GET /api/admin/kpis
GET /api/admin/productos-mas-vendidos
GET /api/admin/ventas-por-mes
GET /api/admin/ventas-por-categoria
GET /api/admin/ventas-por-tipo-cliente
```

### Admin — Inventario

```txt
GET  /api/admin/inventario/productos
GET  /api/admin/inventario/movimientos
POST /api/admin/inventario/movimiento
PUT  /api/admin/inventario/productos/:id/umbrales
```

---

## Ejemplo de prueba de venta por API

Endpoint:

```txt
POST http://localhost:3001/api/ventas/confirmar-directa
```

Body JSON (usuario registrado):

```json
{
  "idUsuario": 1,
  "idCliente": 1,
  "idEmpresa": 1,
  "tipoCliente": "REGISTRADO",
  "tipoEntrega": "RETIRO_TIENDA",
  "items": [
    {
      "idProducto": 1,
      "cantidad": 2,
      "precioUnitario": 5000,
      "subtotalLinea": 10000
    }
  ]
}
```

Body JSON (invitado):

```json
{
  "idUsuario": null,
  "idCliente": 1,
  "idEmpresa": 1,
  "tipoCliente": "INVITADO",
  "tipoEntrega": "RETIRO_TIENDA",
  "items": [
    {
      "idProducto": 2,
      "cantidad": 1,
      "precioUnitario": 8990,
      "subtotalLinea": 8990
    }
  ]
}
```

---

## Base de datos

La base de datos se genera localmente mediante SQLite.

Archivos importantes:

```txt
backend/src/database/schema.sql       → estructura de tablas operacionales
backend/src/database/seed.sql         → datos iniciales de prueba
backend/src/database/initDb.js        → script de inicialización
backend/src/database/migrateAdminBi.js → migración al esquema estrella BI
```

Para recrear la base de datos:

```bash
npm run init-db
```

Si se necesita reiniciar completamente la base, eliminar el archivo local:

```txt
backend/src/database/puppypet.db
```

y luego ejecutar nuevamente:

```bash
npm run init-db
```

---

## Generación de XML

Al confirmar una venta, el backend genera un XML asociado a la boleta.

El XML contiene:

- Tipo de documento (código DTE 39 — Boleta).
- Folio.
- Fecha de emisión (formato ISO).
- Datos del emisor (empresa).
- Datos del receptor (cliente registrado o consumidor final).
- Neto, IVA y total.
- Detalle de productos vendidos.

El XML se genera desde:

```txt
backend/src/services/generadorXmlService.js
```

> **Importante:** la generación de XML corresponde a una simulación académica. No representa una emisión tributaria real ante el SII, ya que no incluye firma electrónica, CAF, timbre electrónico ni envío al Servicio de Impuestos Internos.

---

## Comentarios de código

El 100% del código fuente está documentado con comentarios de nivel usuario:

- Escritos en tercera persona (`Se importa...`, `Se verifica...`, `Se dispara...`).
- Explican el **por qué** de cada decisión técnica, no solo el qué.
- Referencian el stack: SQLite, bcryptjs, React Router v6, localStorage, eventos DOM personalizados.

Total: **53 archivos comentados** (33 backend + 20 frontend).

---

## Consideraciones importantes

- Backend y frontend deben ejecutarse al mismo tiempo.
- El backend usa el puerto `3001`.
- El frontend usa el puerto `3000`.
- La base SQLite se genera localmente y no se sube al repositorio.
- No se debe subir `node_modules`.
- Si se actualiza `seed.sql`, se debe recrear la base ejecutando `npm run init-db`.
- El carrito se maneja en `localStorage` del navegador.
- Un usuario INACTIVO no puede iniciar sesión aunque sus credenciales sean correctas.

---

## Comandos rápidos

### Backend

```bash
cd backend
npm install
npm run init-db
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Estado actual del proyecto

```txt
✔ Catálogo dinámico con filtro por categoría
✔ Carrito de compras con persistencia en localStorage
✔ Cálculo de neto, IVA y total
✔ Registro de venta con detalle y descuento de stock
✔ Generación de XML de boleta (simulación SII)
✔ Sistema de usuarios: registro, login, perfil, historial de compras
✔ Validación de RUT chileno (módulo 11) y política de contraseña segura
✔ Encriptación de contraseñas con bcryptjs
✔ Panel de administración con Dashboard BI (esquema estrella)
✔ Gestión de inventario con semáforo de stock y trazabilidad de movimientos
✔ Gestión de usuarios: cambio de rol y activación/desactivación
✔ 100% del código fuente comentado (nivel usuario)
```

---

DEV: Alexandra Crispín Yañez - Alejandro González Queupumil
