const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

router.get("/kpis", AdminController.obtenerKpis);
router.get("/productos-mas-vendidos", AdminController.productosMasVendidos);
router.get("/ventas-por-mes", AdminController.ventasPorMes);
router.get("/ventas-por-categoria", AdminController.ventasPorCategoria);
router.get("/ventas-por-tipo-cliente", AdminController.ventasPorTipoCliente);

module.exports = router;
