// Express Router organiza las rutas del panel administrativo bajo el prefijo /api/admin
const express = require("express");
const router = express.Router();

// Se importa el controlador que provee los datos del dashboard BI
const AdminController = require("../controllers/adminController");

// Obtiene los KPIs principales del negocio (total ventas, cantidad de transacciones, etc.)
router.get("/kpis", AdminController.obtenerKpis);

// Obtiene el ranking de productos más vendidos para el gráfico del dashboard
router.get("/productos-mas-vendidos", AdminController.productosMasVendidos);

// Obtiene el total de ventas agrupadas por mes para el gráfico de tendencia
router.get("/ventas-por-mes", AdminController.ventasPorMes);

// Obtiene el total de ventas agrupadas por categoría de producto
router.get("/ventas-por-categoria", AdminController.ventasPorCategoria);

// Obtiene el total de ventas segmentado por tipo de cliente (registrado o invitado)
router.get("/ventas-por-tipo-cliente", AdminController.ventasPorTipoCliente);

// Se exporta el router para ser registrado en app.js
module.exports = router;
