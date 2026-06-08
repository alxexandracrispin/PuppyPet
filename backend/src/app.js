// Express es el framework principal del backend,
// encargado de gestionar las rutas y las peticiones HTTP.
const express = require("express");

// CORS permite que el frontend React (puerto 3000) pueda comunicarse
// con el backend Express (puerto 3001) sin ser bloqueado por el navegador.
const cors = require("cors");

// Se importan las rutas de cada módulo del sistema.
// Cada archivo agrupa los endpoints relacionados a su funcionalidad.
const usuarioRoutes    = require("./routes/usuarioRoutes");
const productoRoutes   = require("./routes/productoRoutes");
const categoriaRoutes  = require("./routes/categoriaRoutes");
const ventaRoutes      = require("./routes/ventaRoutes");
const adminRoutes      = require("./routes/adminRoutes");
const inventarioRoutes = require("./routes/inventarioRoutes");

// Se crea la instancia principal de Express que representa la aplicación backend
const app = express();

// Puerto en el que el servidor escucha las peticiones entrantes
const PORT = 3001;

// Se habilita CORS para aceptar peticiones desde el frontend React
app.use(cors());

// Se habilita la lectura de cuerpos JSON en las peticiones (req.body)
app.use(express.json());

// Ruta raíz para verificar que el servidor está operativo
app.get("/", (req, res) => {
  res.json({
    mensaje: "API PuppyPet funcionando correctamente",
    version: "1.0.0"
  });
});

// Se registran las rutas de cada módulo bajo el prefijo /api
app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/inventario", inventarioRoutes);

// Se inicia el servidor y se confirma en consola cuando está listo
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
