const AdminModel = require("../models/adminModel");

// Función reutilizable que construye el callback para cada endpoint del dashboard.
// Si hay error responde 500; si no, retorna los datos directamente al cliente
const responder = (res, mensajeError) => (error, data) => {
  if (error) {
    return res.status(500).json({
      mensaje: mensajeError,
      error: error.message
    });
  }

  return res.json(data);
};

const AdminController = {

  // Retorna los KPIs del dashboard: total vendido, cantidad de ventas, ticket promedio
  obtenerKpis: (req, res) => {
    AdminModel.obtenerKpis(responder(res, "Error al obtener KPIs"));
  },

  // Retorna el ranking de los 10 productos más vendidos por unidades
  productosMasVendidos: (req, res) => {
    AdminModel.productosMasVendidos(
      responder(res, "Error al obtener productos más vendidos")
    );
  },

  // Retorna el total de ventas agrupado por mes para el gráfico de tendencia
  ventasPorMes: (req, res) => {
    AdminModel.ventasPorMes(responder(res, "Error al obtener ventas por mes"));
  },

  // Retorna las ventas segmentadas por categoría de producto
  ventasPorCategoria: (req, res) => {
    AdminModel.ventasPorCategoria(
      responder(res, "Error al obtener ventas por categoría")
    );
  },

  // Retorna las ventas segmentadas por tipo de cliente (registrado vs invitado)
  ventasPorTipoCliente: (req, res) => {
    AdminModel.ventasPorTipoCliente(
      responder(res, "Error al obtener ventas por tipo de cliente")
    );
  }
};

module.exports = AdminController;
