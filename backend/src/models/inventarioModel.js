const db = require("../config/database");

const InventarioModel = {

  // Obtiene todos los productos activos con su estado de stock según umbrales configurados.
  // El CASE WHEN asigna el color del semáforo: ROJO (crítico), AMARILLO (alerta) o VERDE (normal)
  obtenerProductosConStock: (callback) => {
    const sql = `
      SELECT
        p.id_producto, p.codigo_interno, p.nombre_producto, p.descripcion,
        p.precio, p.stock, p.stock_critico, p.stock_alerta,
        CASE
          WHEN p.stock <= p.stock_critico THEN 'ROJO'
          WHEN p.stock <= p.stock_alerta  THEN 'AMARILLO'
          ELSE 'VERDE'
        END AS estado_stock,
        p.estado, c.nombre_categoria
      FROM producto p
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE p.estado = 'ACTIVO'
      ORDER BY p.nombre_producto ASC
    `;
    db.all(sql, [], callback);
  },

  // Obtiene el historial completo de movimientos con nombre de producto y usuario responsable
  obtenerMovimientos: (callback) => {
    const sql = `
      SELECT
        mi.id_movimiento, mi.id_producto, p.nombre_producto,
        mi.id_usuario, u.nombre || ' ' || u.apellido AS usuario,
        mi.tipo_movimiento, mi.cantidad,
        mi.stock_anterior, mi.stock_nuevo,
        mi.motivo, mi.observacion, mi.fecha_movimiento
      FROM movimiento_inventario mi
      INNER JOIN producto p ON mi.id_producto = p.id_producto
      LEFT JOIN usuario u ON mi.id_usuario = u.id_usuario  -- LEFT JOIN: algunos movimientos pueden no tener usuario
      ORDER BY mi.id_movimiento DESC
    `;
    db.all(sql, [], callback);
  },

  // Registra un movimiento de inventario dentro de una transacción.
  // Se usa transacción para garantizar que el stock y el registro del movimiento
  // se actualicen juntos, o no se actualice ninguno si ocurre un error
  registrarMovimiento: (datos, callback) => {
    const { idProducto, idUsuario, tipoMovimiento, cantidad, motivo, observacion } = datos;

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      // Se consulta el stock actual del producto antes de modificarlo
      const obtenerStockSql = `
        SELECT stock FROM producto WHERE id_producto = ? AND estado = 'ACTIVO'
      `;

      db.get(obtenerStockSql, [idProducto], (errorStock, producto) => {
        if (errorStock) { db.run("ROLLBACK"); return callback(errorStock); }
        if (!producto)  { db.run("ROLLBACK"); return callback(new Error("Producto no encontrado o inactivo")); }

        const stockAnterior = producto.stock;
        let stockNuevo = stockAnterior;

        // Se calcula el nuevo stock según si es entrada o salida
        if (tipoMovimiento === "ENTRADA") {
          stockNuevo = stockAnterior + cantidad;
        } else if (tipoMovimiento === "SALIDA") {
          if (cantidad > stockAnterior) {
            db.run("ROLLBACK");
            return callback(new Error("No se puede descontar más stock del disponible"));
          }
          stockNuevo = stockAnterior - cantidad;
        } else {
          db.run("ROLLBACK");
          return callback(new Error("Tipo de movimiento inválido"));
        }

        // Se actualiza el stock del producto en la tabla operacional
        const actualizarStockSql = `UPDATE producto SET stock = ? WHERE id_producto = ?`;

        db.run(actualizarStockSql, [stockNuevo, idProducto], function (errorUpdate) {
          if (errorUpdate) { db.run("ROLLBACK"); return callback(errorUpdate); }

          // Se registra el movimiento guardando el stock antes y después del cambio
          const insertarMovimientoSql = `
            INSERT INTO movimiento_inventario (
              id_producto, id_usuario, tipo_movimiento, cantidad,
              stock_anterior, stock_nuevo, motivo, observacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          db.run(insertarMovimientoSql, [
            idProducto, idUsuario || null, tipoMovimiento, cantidad,
            stockAnterior, stockNuevo, motivo, observacion || null
          ], function (errorInsert) {
            if (errorInsert) { db.run("ROLLBACK"); return callback(errorInsert); }

            const idMovimiento = this.lastID;

            // Se confirma la transacción solo si ambas operaciones fueron exitosas
            db.run("COMMIT", (errorCommit) => {
              if (errorCommit) { db.run("ROLLBACK"); return callback(errorCommit); }
              callback(null, {
                idMovimiento, idProducto, tipoMovimiento, cantidad,
                stockAnterior, stockNuevo, motivo, observacion
              });
            });
          });
        });
      });
    });
  },

  // Actualiza los umbrales de stock crítico y alerta de un producto.
  // Estos valores determinan el color del semáforo en el panel de inventario
  actualizarUmbralesStock: (datos, callback) => {
    const { idProducto, stockCritico, stockAlerta } = datos;
    const sql = `
      UPDATE producto
      SET stock_critico = ?, stock_alerta = ?
      WHERE id_producto = ? AND estado = 'ACTIVO'
    `;
    db.run(sql, [stockCritico, stockAlerta, idProducto], function (error) {
      callback(error, this?.changes);
    });
  }
};

module.exports = InventarioModel;
