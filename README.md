# PuppyPet MVC - Punto de venta con React, Express, SQLite, AdminLTE y BI

PuppyPet es una aplicación web desarrollada como proyecto académico para simular un punto de venta orientado a una tienda de mascotas. El sistema permite visualizar productos, registrar usuarios, iniciar sesión, administrar un carrito de compras, confirmar ventas, descontar stock, generar una boleta imprimible y crear un XML asociado a la venta.

Además, el proyecto incorpora un panel administrativo tipo AdminLTE para visualizar indicadores de negocio y gestionar inventario. El dashboard administrativo se apoya en un modelo estrella simple para inteligencia de negocio, permitiendo analizar ventas por producto, categoría, período y tipo de cliente.

---

## Objetivo del proyecto

El objetivo principal del sistema es transformar una página estática en una aplicación web funcional, organizada bajo una estructura cercana al patrón MVC, separando la interfaz visual, la lógica de negocio, las rutas de API, los modelos de datos y la base de datos.

El proyecto busca demostrar conocimientos en desarrollo frontend, backend, base de datos relacional, consumo de API REST, validaciones funcionales, seguridad básica, control de inventario, generación de documentos y visualización de indicadores de negocio.

---

## Tecnologías utilizadas

### Frontend

- React
- React Router DOM
- React Bootstrap
- Bootstrap
- React Icons
- Axios
- CSS personalizado

### Backend

- Node.js
- Express
- SQLite
- bcryptjs
- CORS
- Nodemon

### Base de datos

- SQLite
- Script de creación de tablas `schema.sql`
- Script de datos iniciales `seed.sql`
- Script de inicialización `initDb.js`
- Script de migración para módulo administrativo y BI `migrateAdminBi.js`

---

## Estructura general del proyecto

```txt
PuppyPet/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   ├── categoriaController.js
│   │   │   ├── inventarioController.js
│   │   │   ├── productoController.js
│   │   │   ├── usuarioController.js
│   │   │   └── ventaController.js
│   │   │
│   │   ├── database/
│   │   │   ├── initDb.js
│   │   │   ├── migrateAdminBi.js
│   │   │   ├── puppypet.db
│   │   │   ├── schema.sql
│   │   │   └── seed.sql
│   │   │
│   │   ├── models/
│   │   │   ├── adminModel.js
│   │   │   ├── categoriaModel.js
│   │   │   ├── documentoXmlModel.js
│   │   │   ├── inventarioModel.js
│   │   │   ├── productoModel.js
│   │   │   ├── usuarioModel.js
│   │   │   └── ventaModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── categoriaRoutes.js
│   │   │   ├── inventarioRoutes.js
│   │   │   ├── productoRoutes.js
│   │   │   ├── usuarioRoutes.js
│   │   │   └── ventaRoutes.js
│   │   │
│   │   ├── services/
│   │   │   └── generadorXmlService.js
│   │   │
│   │   └── app.js
│   │
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── assets/images/
│   │
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── AdminDashboard.css
│   │   │   └── inventario/
│   │   │       ├── AdminInventario.js
│   │   │       └── AdminInventario.css
│   │   │
│   │   ├── api/
│   │   │   └── api.js
│   │   │
│   │   ├── components/
│   │   │   ├── BoletaTicket.js
│   │   │   ├── Footer.js
│   │   │   ├── Layout.js
│   │   │   ├── NavbarPrincipal.js
│   │   │   └── ProductoCard.js
│   │   │
│   │   ├── pages/
│   │   │   ├── Carrito.js
│   │   │   ├── Catalogo.js
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── MiPerfil.js
│   │   │   ├── MisCompras.js
│   │   │   ├── Nosotros.js
│   │   │   ├── ProductoDetalle.js
│   │   │   ├── Registro.js
│   │   │   └── VentaConfirmada.js
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   └── package.json
│
└── README.md
```

---

## Arquitectura aplicada

El backend se organiza con una estructura cercana al patrón MVC:

```txt
Routes       → Definen los endpoints de la API
Controllers  → Reciben la solicitud y aplican validaciones/lógica
Models       → Ejecutan consultas SQL y operaciones sobre la base de datos
Services     → Contienen procesos específicos, como generación de XML
Database     → Contiene scripts SQL y archivo SQLite
```

En el frontend, React cumple el rol de capa visual, separando páginas, componentes reutilizables y vistas administrativas.

---

## Funcionalidades principales

### 1. Catálogo de productos

El sistema muestra productos disponibles en la tienda, obtenidos desde la base de datos.

Cada producto puede contener:

- Código interno
- Nombre
- Descripción
- Precio
- Stock disponible
- Imagen
- Categoría
- Estado

También se permite filtrar productos por categoría.

---

### 2. Carrito de compras

El usuario puede agregar productos al carrito, revisar cantidades y confirmar la compra.

Flujo general:

```txt
Catálogo → Producto → Carrito → Confirmar venta → Venta confirmada
```

---

### 3. Registro de usuarios

El sistema permite registrar usuarios con datos personales y credenciales de acceso.

Validaciones consideradas:

- Nombre obligatorio
- Apellido obligatorio
- RUT obligatorio
- Validación de RUT mediante módulo 11
- Correo obligatorio y único
- Contraseña segura
- Confirmación de contraseña
- Dirección, comuna y ciudad obligatorias

Las contraseñas se almacenan utilizando bcryptjs, evitando guardar claves en texto plano.

---

### 4. Inicio de sesión

El sistema permite iniciar sesión validando correo y contraseña.

El proceso separa dos responsabilidades:

```txt
1. Buscar usuario por correo
2. Comparar contraseña ingresada contra el hash guardado con bcryptjs
```

Una vez validado el usuario, se almacena información básica de sesión para mantener la navegación del usuario en el frontend.

---

### 5. Perfil de usuario

El sistema incorpora una página de perfil, donde el usuario puede actualizar información personal y modificar su contraseña.

Rutas backend asociadas:

```txt
PUT /api/usuarios/:id
PUT /api/usuarios/:id/password
```

---

### 6. Mis compras

El sistema permite consultar las compras realizadas por un usuario registrado.

Ruta backend asociada:

```txt
GET /api/ventas/usuario/:idUsuario
```

Esto permite que el usuario pueda revisar su historial de compras dentro de la aplicación.

---

### 7. Confirmación de venta

Al confirmar una venta, el backend registra la cabecera y el detalle de la venta, descuenta stock y genera el documento XML asociado.

Ruta backend principal:

```txt
POST /api/ventas/confirmar-directa
```

Proceso general:

```txt
Recibir productos del carrito
Validar datos de venta
Registrar venta
Registrar detalle de venta
Descontar stock
Registrar datos para BI
Generar XML
Guardar XML en base de datos
Mostrar venta confirmada
```

---

### 8. Boleta imprimible

Después de confirmar una venta, el sistema muestra una boleta visual en HTML mediante el componente `BoletaTicket.js`.

La boleta incluye:

- Datos de la empresa emisora
- Datos del cliente o consumidor final
- Fecha de emisión
- Folio
- Detalle de productos
- Subtotal
- IVA
- Total

---

### 9. Generación de XML

El proyecto incluye un servicio para generar un XML asociado a la venta.

Archivo principal:

```txt
backend/src/services/generadorXmlService.js
```

El XML considera información como:

- Tipo de documento
- Código DTE 39
- Folio
- Fecha de emisión
- Datos del emisor
- Datos del receptor
- Detalle de productos
- Totales del documento

Importante: esta generación corresponde a una simulación académica. No corresponde a una integración oficial ni validada ante el SII.

---

## Panel administrativo tipo AdminLTE

El proyecto incorpora un panel administrativo accesible desde:

```txt
/admin
```

Este panel está diseñado con estética tipo AdminLTE y permite visualizar información resumida del negocio.

Indicadores disponibles:

- Total vendido
- Cantidad de ventas
- Productos vendidos
- Ticket promedio
- Productos más vendidos
- Ventas por mes
- Ventas por categoría
- Ventas por tipo de cliente

Rutas backend asociadas:

```txt
GET /api/admin/kpis
GET /api/admin/productos-mas-vendidos
GET /api/admin/ventas-por-mes
GET /api/admin/ventas-por-categoria
GET /api/admin/ventas-por-tipo-cliente
```

---

## Módulo de inventario

El sistema incorpora una vista administrativa para gestionar movimientos de inventario:

```txt
/admin/inventario
```

Funcionalidades:

- Ver productos con stock actual
- Registrar entrada de stock
- Registrar salida de stock
- Validar cantidad mayor a cero
- Evitar stock negativo
- Registrar motivo del movimiento
- Registrar observación
- Guardar historial de movimientos

Rutas backend asociadas:

```txt
GET /api/admin/inventario/productos
GET /api/admin/inventario/movimientos
POST /api/admin/inventario/movimiento
```

Tabla asociada:

```txt
movimiento_inventario
```

Campos principales:

- Producto
- Usuario
- Tipo de movimiento
- Cantidad
- Stock anterior
- Stock nuevo
- Motivo
- Observación
- Fecha del movimiento

---

## Modelo estrella para BI

El proyecto incorpora una estructura simple de inteligencia de negocio basada en un modelo estrella.

La tabla central es:

```txt
hecho_venta
```

Dimensiones asociadas:

```txt
dim_producto
dim_categoria
dim_tiempo
dim_cliente_tipo
```

Este modelo permite analizar las ventas desde distintas perspectivas:

- Producto vendido
- Categoría del producto
- Fecha o mes de venta
- Tipo de cliente
- Cantidad vendida
- Subtotal
- IVA
- Total

La idea central es separar la base operacional de venta de una estructura analítica más simple para reportes y dashboard.

---

## Base de datos

Principales tablas operacionales:

```txt
usuario
empresa_emisora
cliente
categoria
producto
venta
detalle_venta
documento_xml
movimiento_inventario
```

Tablas de inteligencia de negocio:

```txt
dim_categoria
dim_producto
dim_tiempo
dim_cliente_tipo
hecho_venta
```

---

## Endpoints principales

### Productos

```txt
GET /api/productos
GET /api/productos/categoria/:categoria
GET /api/productos/:id
```

### Categorías

```txt
GET /api/categorias
```

### Usuarios

```txt
GET /api/usuarios
POST /api/usuarios/registro
POST /api/usuarios/login
PUT /api/usuarios/:id
PUT /api/usuarios/:id/password
```

### Ventas

```txt
POST /api/ventas/confirmar-directa
GET /api/ventas/usuario/:idUsuario
GET /api/ventas/:idVenta
GET /api/ventas/:idVenta/xml
```

### Administración / BI

```txt
GET /api/admin/kpis
GET /api/admin/productos-mas-vendidos
GET /api/admin/ventas-por-mes
GET /api/admin/ventas-por-categoria
GET /api/admin/ventas-por-tipo-cliente
```

### Inventario

```txt
GET /api/admin/inventario/productos
GET /api/admin/inventario/movimientos
POST /api/admin/inventario/movimiento
```

---

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd PuppyPet
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Inicializar base de datos

```bash
npm run init-db
```

### 4. Ejecutar backend

```bash
npm run dev
```

El backend queda disponible en:

```txt
http://localhost:3001
```

### 5. Instalar dependencias del frontend

En otra terminal:

```bash
cd frontend
npm install
```

### 6. Ejecutar frontend

```bash
npm start
```

El frontend queda disponible en:

```txt
http://localhost:3000
```

---

## Rutas principales del frontend

```txt
/                       Inicio
/catalogo               Catálogo general
/catalogo/:categoria    Catálogo filtrado por categoría
/producto/:idProducto   Detalle de producto
/carrito                Carrito de compras
/venta-confirmada/:id   Venta confirmada y boleta
/login                  Inicio de sesión
/registro               Registro de usuario
/perfil                 Perfil de usuario
/mis-compras            Historial de compras
/nosotros               Información del equipo
/admin                  Dashboard administrativo
/admin/inventario       Gestión de inventario
```

---

## Seguridad y buenas prácticas aplicadas

El proyecto considera buenas prácticas básicas como:

- Separación de responsabilidades entre rutas, controladores, modelos y servicios.
- Uso de consultas parametrizadas con `?` para reducir riesgo de inyección SQL.
- Uso de bcryptjs para proteger contraseñas.
- Validación de campos obligatorios.
- Validación de RUT mediante módulo 11.
- Validación de stock antes de registrar salidas de inventario.
- Separación entre vista pública y vista administrativa.

---

## Pruebas realizadas

El proyecto fue probado funcionalmente considerando:

- Visualización de productos.
- Filtro por categorías.
- Registro de usuario.
- Inicio de sesión.
- Agregar productos al carrito.
- Confirmar venta.
- Descuento de stock.
- Generación de boleta visual.
- Generación y consulta de XML.
- Consulta de compras por usuario.
- Visualización de dashboard administrativo.
- Indicadores BI.
- Movimientos de inventario.
- Validación contra cantidades negativas o salidas mayores al stock disponible.

También se realizaron pruebas de API con herramientas como Bruno.

---

## Alcance académico

Este proyecto tiene fines académicos. La generación de XML de boleta es una simulación técnica y no corresponde a una emisión tributaria oficial certificada ante el SII.

El sistema permite demostrar una integración completa entre frontend, backend, base de datos, reglas de negocio, control de inventario, visualización administrativa y análisis básico de datos.

---

## Posibles mejoras futuras

Algunas mejoras proyectadas son:

- Crear módulo de administración de productos desde el panel.
- Permitir carga real de imágenes mediante backend.
- Implementar autenticación con JWT.
- Proteger rutas administrativas desde backend.
- Agregar roles y permisos más detallados.
- Exportar reportes de ventas.
- Mejorar el modelo XML para acercarlo a un estándar tributario real.
- Incorporar medios de pago.
- Crear cierre de caja o arqueo de caja.
- Agregar pruebas unitarias y de integración.

---

## Descripción breve para defensa

PuppyPet es una aplicación web de punto de venta para una tienda de mascotas. Permite visualizar productos, registrar usuarios, iniciar sesión, vender productos mediante un carrito, descontar stock, generar una boleta imprimible y crear un XML asociado a la venta.

Además, incorpora un panel administrativo tipo AdminLTE con indicadores de negocio y un módulo de inventario. Para la visualización de datos, se implementa un modelo estrella simple con tabla de hechos de ventas y dimensiones de producto, categoría, tiempo y tipo de cliente.

Técnicamente, el backend está construido con Express y SQLite, organizado en rutas, controladores, modelos y servicios. El frontend está desarrollado con React, separando páginas, componentes reutilizables y vistas administrativas.

---

## Autores

Proyecto académico desarrollado por el equipo PuppyPet.

Integrantes:

- Alexandra Crispín Yáñez
- Alejandro González Queupumil
