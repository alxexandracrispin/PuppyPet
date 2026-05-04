const db = require("../config/database");

const ProductoModel = {
  obtenerTodos: (callback) => {
    const sql = `
      SELECT 
        p.id_producto,
        p.codigo_interno,
        p.nombre_producto,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen_url,
        p.estado,
        c.id_categoria,
        c.nombre_categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'ACTIVO'
      ORDER BY p.id_producto ASC
    `;

    db.all(sql, [], callback);
  },

  obtenerPorCategoria: (nombreCategoria, callback) => {
    const sql = `
      SELECT 
        p.id_producto,
        p.codigo_interno,
        p.nombre_producto,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen_url,
        p.estado,
        c.id_categoria,
        c.nombre_categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'ACTIVO'
        AND LOWER(c.nombre_categoria) = LOWER(?)
      ORDER BY p.nombre_producto ASC
    `;

    db.all(sql, [nombreCategoria], callback);
  },

  obtenerPorId: (idProducto, callback) => {
    const sql = `
      SELECT 
        p.id_producto,
        p.codigo_interno,
        p.nombre_producto,
        p.descripcion,
        p.precio,
        p.stock,
        p.imagen_url,
        p.estado,
        c.id_categoria,
        c.nombre_categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?
    `;

    db.get(sql, [idProducto], callback);
  },

  descontarStock: (idProducto, cantidad, callback) => {
    const sql = `
      UPDATE producto
      SET stock = stock - ?
      WHERE id_producto = ?
        AND stock >= ?
    `;

    db.run(sql, [cantidad, idProducto, cantidad], function (error) {
      callback(error, this);
    });
  }
};

module.exports = ProductoModel;