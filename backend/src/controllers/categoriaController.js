// Se importa el modelo de categoría para ejecutar las consultas a la base de datos
const CategoriaModel = require("../models/categoriaModel");

const CategoriaController = {

  // Retorna todas las categorías activas para poblar el selector del catálogo
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
