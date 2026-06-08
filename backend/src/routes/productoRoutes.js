// Express Router organiza las rutas de productos bajo el prefijo /api/productos
const express = require("express");
const router = express.Router();

// Se importa el controlador que contiene la lógica de cada endpoint de productos
const ProductoController = require("../controllers/productoController");

// Obtiene el listado completo de productos activos del catálogo
router.get("/", ProductoController.obtenerProductos);

// Obtiene los productos filtrados por una categoría específica
router.get("/categoria/:categoria", ProductoController.obtenerProductosPorCategoria);

// Obtiene el detalle completo de un producto por su ID
router.get("/:id", ProductoController.obtenerProductoPorId);

// Se exporta el router para ser registrado en app.js
module.exports = router;
