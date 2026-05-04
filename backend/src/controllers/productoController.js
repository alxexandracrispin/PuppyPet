const ProductoModel = require("../models/productoModel");

const ProductoController = {
  obtenerProductos: (req, res) => {
    ProductoModel.obtenerTodos((error, productos) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener productos",
          error: error.message
        });
      }

      return res.json(productos);
    });
  },

  obtenerProductosPorCategoria: (req, res) => {
    const { categoria } = req.params;

    ProductoModel.obtenerPorCategoria(categoria, (error, productos) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener productos por categoría",
          error: error.message
        });
      }

      return res.json(productos);
    });
  },

  obtenerProductoPorId: (req, res) => {
    const { id } = req.params;

    ProductoModel.obtenerPorId(id, (error, producto) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener producto",
          error: error.message
        });
      }

      if (!producto) {
        return res.status(404).json({
          mensaje: "Producto no encontrado"
        });
      }

      return res.json(producto);
    });
  }
};

module.exports = ProductoController;