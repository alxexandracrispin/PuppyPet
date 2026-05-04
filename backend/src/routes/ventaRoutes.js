const express = require("express");
const router = express.Router();

const VentaController = require("../controllers/ventaController");

// Confirmar venta desde el carrito del frontend y generar XML
router.post("/confirmar-directa", VentaController.confirmarVentaDirecta);

// Obtener XML generado de una venta
// Importante: esta ruta debe ir antes de "/:idVenta"
router.get("/:idVenta/xml", VentaController.obtenerXml);

// Obtener datos completos de una venta
router.get("/:idVenta", VentaController.obtenerVenta);

module.exports = router;