const AdminModel = require("../models/adminModel");

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
  obtenerKpis: (req, res) => {
    AdminModel.obtenerKpis(responder(res, "Error al obtener KPIs"));
  },

  productosMasVendidos: (req, res) => {
    AdminModel.productosMasVendidos(
      responder(res, "Error al obtener productos más vendidos")
    );
  },

  ventasPorMes: (req, res) => {
    AdminModel.ventasPorMes(responder(res, "Error al obtener ventas por mes"));
  },

  ventasPorCategoria: (req, res) => {
    AdminModel.ventasPorCategoria(
      responder(res, "Error al obtener ventas por categoría")
    );
  },

  ventasPorTipoCliente: (req, res) => {
    AdminModel.ventasPorTipoCliente(
      responder(res, "Error al obtener ventas por tipo de cliente")
    );
  }
};

module.exports = AdminController;
