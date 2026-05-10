const express = require("express");
const router = express.Router();

const VentaController = require("../controllers/ventaController");

// Confirmar venta desde el carrito del frontend y generar XML
router.post("/confirmar-directa", VentaController.confirmarVentaDirecta);

// obtiene ventas de usuarios registrados
router.get("/usuario/:idUsuario", VentaController.obtenerVentasPorUsuario);

// Obtener XML generado de una venta

router.get("/:idVenta/xml", VentaController.obtenerXml);

// Obtener datos completos de una venta
router.get("/:idVenta", VentaController.obtenerVenta);



module.exports = router;