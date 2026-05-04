const db = require("../config/database");

const CategoriaModel = {
  obtenerTodas: (callback) => {
    const sql = `
      SELECT 
        id_categoria,
        nombre_categoria,
        descripcion,
        estado
      FROM categoria
      WHERE estado = 'ACTIVO'
      ORDER BY nombre_categoria ASC
    `;

    db.all(sql, [], callback);
  }
};

module.exports = CategoriaModel;