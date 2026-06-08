// Express Router organiza las rutas de inventario bajo el prefijo /api/admin/inventario
const express = require("express");
const router = express.Router();

// Se importa el controlador que gestiona el inventario y los movimientos de stock
const InventarioController = require("../controllers/inventarioController");

// Obtiene todos los productos con su stock actual, umbrales y estado del semáforo
router.get("/productos", InventarioController.obtenerProductosConStock);

// Obtiene el historial de movimientos de inventario (entradas y salidas de stock)
router.get("/movimientos", InventarioController.obtenerMovimientos);

// Registra un nuevo movimiento de inventario (suma o resta de stock con motivo)
router.post("/movimiento", InventarioController.registrarMovimiento);

// Actualiza los umbrales de stock crítico y alerta de un producto específico
router.put(
  "/productos/:idProducto/umbrales",
  InventarioController.actualizarUmbralesStock
);

// Se exporta el router para ser registrado en app.js
module.exports = router;
