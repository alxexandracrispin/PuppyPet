// Express Router organiza las rutas de ventas bajo el prefijo /api/ventas
const express = require("express");
const router = express.Router();

// Se importa el controlador que contiene la lógica de cada endpoint de ventas
const VentaController = require("../controllers/ventaController");

// Confirma una venta desde el carrito del frontend, registra el detalle,
// descuenta el stock y genera el XML simulado de la boleta
router.post("/confirmar-directa", VentaController.confirmarVentaDirecta);

// Obtiene el historial de ventas de un usuario registrado por su ID
router.get("/usuario/:idUsuario", VentaController.obtenerVentasPorUsuario);

// Obtiene el XML generado y almacenado para una venta específica
router.get("/:idVenta/xml", VentaController.obtenerXml);

// Obtiene los datos completos de una venta incluyendo su detalle de productos
router.get("/:idVenta", VentaController.obtenerVenta);

// Se exporta el router para ser registrado en app.js
module.exports = router;
