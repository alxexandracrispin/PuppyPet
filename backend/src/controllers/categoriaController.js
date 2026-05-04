const CategoriaModel = require("../models/categoriaModel");

const CategoriaController = {
  obtenerCategorias: (req, res) => {
    CategoriaModel.obtenerTodas((error, categorias) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener categorías",
          error: error.message
        });
      }

      return res.json(categorias);
    });
  }
};

module.exports = CategoriaController;