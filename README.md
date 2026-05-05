# PuppyPet - Aplicación Web con MVC, React y Generación XML

## Descripción del proyecto

PuppyPet es una aplicación web desarrollada como proyecto académico. Originalmente el sistema estaba construido como un sitio HTML estático, pero fue migrado a una aplicación web funcional con frontend, backend, base de datos y generación de XML.

El proyecto simula un punto de venta para una tienda de mascotas. El objetivo principal no es solo mostrar productos, sino representar el flujo completo de una venta:

```txt
Catálogo → Carrito → Confirmar venta → Registrar venta → Generar XML
````

La aplicación permite visualizar productos por categoría, agregarlos al carrito, confirmar una venta y generar un XML asociado a la boleta.

---

## Tecnologías utilizadas

### Frontend

* React
* React Bootstrap
* React Router DOM
* Axios
* React Icons
* Bootstrap 5

### Backend

* Node.js
* Express
* SQLite
* Arquitectura MVC

### Base de datos

* SQLite
* Scripts SQL para creación de tablas y carga inicial de datos

---

## Estructura general del proyecto

```txt
PuppyPet/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── assets/
│   │       └── images/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
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

* Catálogo dinámico de productos.
* Filtro de productos por categoría.
* Carrito de compras.
* Cálculo de neto, IVA y total.
* Registro de venta.
* Registro de detalle de venta.
* Descuento de stock.
* Generación de XML de boleta.
* Visualización del XML generado.
* Diseño visual basado en el sitio HTML original.

---

## Categorías disponibles

* Perros
* Gatos
* Snack
* Accesorios
* Higiene
* Juguetes

---

## Instalación y ejecución

El proyecto se divide en dos partes:

```txt
backend  → API, base de datos y generación XML
frontend → Interfaz React
```

Deben ejecutarse en terminales separadas.

---

# 1. Ejecutar backend

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

# 2. Ejecutar frontend

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

1. Abrir `http://localhost:3000`.
2. Entrar al catálogo.
3. Seleccionar una categoría.
4. Agregar productos al carrito.
5. Ir al carrito.
6. Confirmar la venta.
7. Revisar la pantalla de venta confirmada.
8. Abrir el XML generado.

---

## Endpoints principales

### Productos

```txt
GET /api/productos
GET /api/productos/:id
GET /api/productos/categoria/:categoria
```

### Categorías

```txt
GET /api/categorias
```

### Ventas

```txt
POST /api/ventas/confirmar-directa
GET /api/ventas/:idVenta
GET /api/ventas/:idVenta/xml
```

---

## Ejemplo de prueba de venta por API

Endpoint:

```txt
POST http://localhost:3001/api/ventas/confirmar-directa
```

Body JSON:

```json
{
  "idUsuario": 1,
  "idCliente": 1,
  "idEmpresa": 1,
  "items": [
    {
      "idProducto": 1,
      "cantidad": 1,
      "precioUnitario": 11490,
      "subtotalLinea": 11490
    }
  ]
}
```

---

## Base de datos

La base de datos se genera localmente mediante SQLite.

Archivos importantes:

```txt
backend/src/database/schema.sql
backend/src/database/seed.sql
backend/src/database/initDb.js
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

* Tipo de documento.
* Folio.
* Fecha de emisión.
* Datos del emisor.
* Datos del receptor.
* Totales.
* Detalle de productos vendidos.

El XML se genera desde:

```txt
backend/src/services/generadorXmlService.js
```

Importante: la generación de XML corresponde a una simulación académica. No representa una emisión tributaria real ante el SII, ya que no incluye firma electrónica, CAF, timbre electrónico ni envío al Servicio de Impuestos Internos (SII).

---

## Consideraciones importantes

* Backend y frontend deben ejecutarse al mismo tiempo.
* El backend usa el puerto `3001`.
* El frontend usa el puerto `3000`.
* La base SQLite se genera localmente.
* No se debe subir `node_modules`.
* Si se actualiza `seed.sql`, se debe recrear la base ejecutando `npm run init-db`.
* El carrito se maneja inicialmente en `localStorage`.

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

El proyecto cuenta con una versión funcional que permite:

```txt
Visualizar catálogo → Agregar productos → Confirmar venta → Generar XML
```

Esto convierte PuppyPet desde una maqueta HTML estática a una aplicación web funcional con backend, persistencia local y generación documental.

````
DEV: Alexandra Crispín Yañez - Alejandro González Queupumil
