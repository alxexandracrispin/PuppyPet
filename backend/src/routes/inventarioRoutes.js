const express = require("express");
const router = express.Router();

const InventarioController = require("../controllers/inventarioController");

router.get("/productos", InventarioController.obtenerProductosConStock);
router.get("/movimientos", InventarioController.obtenerMovimientos);
router.post("/movimiento", InventarioController.registrarMovimiento);
router.put(
  "/productos/:idProducto/umbrales",
  InventarioController.actualizarUmbralesStock
);

module.exports = router;