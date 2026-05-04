const express = require("express");
const router = express.Router();

const ProductoController = require("../controllers/productoController");

router.get("/", ProductoController.obtenerProductos);
router.get("/categoria/:categoria", ProductoController.obtenerProductosPorCategoria);
router.get("/:id", ProductoController.obtenerProductoPorId);

module.exports = router;