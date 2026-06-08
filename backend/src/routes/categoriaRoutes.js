// Express Router organiza las rutas de categorías bajo el prefijo /api/categorias
const express = require("express");
const router = express.Router();

// Se importa el controlador que contiene la lógica del endpoint de categorías
const CategoriaController = require("../controllers/categoriaController");

// Obtiene el listado completo de categorías disponibles para el catálogo
router.get("/", CategoriaController.obtenerCategorias);

// Se exporta el router para ser registrado en app.js
module.exports = router;
