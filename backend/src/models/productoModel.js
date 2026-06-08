const db = require("../config/database");

const ProductoModel = {

  // Obtiene todos los productos activos del catálogo junto con su categoría.
  // Se usa INNER JOIN para asegurar que solo se retornen productos con categoría válida
  obtenerTodos: (callback) => {
    const sql = `
      SELECT
        p.id_producto, p.codigo_interno, p.nombre_producto, p.descripcion,
        p.precio, p.stock, p.imagen_url, p.estado,
        c.id_categoria, c.nombre_categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'ACTIVO'
      ORDER BY p.id_producto ASC
    `;
    db.all(sql, [], callback);
  },

  // Obtiene productos filtrados por nombre de categoría.
  // LOWER() permite que el filtro no distinga entre mayúsculas y minúsculas
  obtenerPorCategoria: (nombreCategoria, callback) => {
    const sql = `
      SELECT
        p.id_producto, p.codigo_interno, p.nombre_producto, p.descripcion,
        p.precio, p.stock, p.imagen_url, p.estado,
        c.id_categoria, c.nombre_categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'ACTIVO'
        AND LOWER(c.nombre_categoria) = LOWER(?)
      ORDER BY p.nombre_producto ASC
    `;
    db.all(sql, [nombreCategoria], callback);
  },

  // Obtiene el detalle completo de un producto específico por su ID
  obtenerPorId: (idProducto, callback) => {
    const sql = `
      SELECT
        p.id_producto, p.codigo_interno, p.nombre_producto, p.descripcion,
        p.precio, p.stock, p.imagen_url, p.estado,
        c.id_categoria, c.nombre_categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.id_producto = ?
    `;
    db.get(sql, [idProducto], callback);
  },

  // Descuenta el stock de un producto al confirmar una venta.
  // La condición AND stock >= ? evita que el stock quede en valores negativos
  descontarStock: (idProducto, cantidad, callback) => {
    const sql = `
      UPDATE producto
      SET stock = stock - ?
      WHERE id_producto = ? AND stock >= ?
    `;
    db.run(sql, [cantidad, idProducto, cantidad], function (error) {
      callback(error, this); // this.changes = 0 indica que no había stock suficiente
    });
  }
};

module.exports = ProductoModel;
