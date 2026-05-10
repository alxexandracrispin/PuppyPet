const db = require("../config/database");

const AdminModel = {
  obtenerKpis: (callback) => {
    const sql = `
      SELECT
        IFNULL(SUM(total_linea), 0) AS totalVendido,
        COUNT(DISTINCT id_venta) AS cantidadVentas,
        IFNULL(SUM(cantidad), 0) AS productosVendidos,
        CASE
          WHEN COUNT(DISTINCT id_venta) = 0 THEN 0
          ELSE ROUND(SUM(total_linea) * 1.0 / COUNT(DISTINCT id_venta), 0)
        END AS ticketPromedio
      FROM hecho_venta;
    `;

    db.get(sql, [], callback);
  },

  productosMasVendidos: (callback) => {
    const sql = `
      SELECT
        p.nombre_producto AS producto,
        SUM(h.cantidad) AS totalVendido,
        SUM(h.total_linea) AS totalIngresos
      FROM hecho_venta h
      INNER JOIN dim_producto p ON h.id_producto = p.id_producto
      GROUP BY p.nombre_producto
      ORDER BY totalVendido DESC, totalIngresos DESC
      LIMIT 10;
    `;

    db.all(sql, [], callback);
  },

  ventasPorMes: (callback) => {
    const sql = `
      SELECT
        t.anio,
        t.mes,
        t.nombre_mes AS mesNombre,
        t.nombre_mes || ' ' || t.anio AS periodo,
        SUM(h.total_linea) AS totalVendido,
        COUNT(DISTINCT h.id_venta) AS cantidadVentas
      FROM hecho_venta h
      INNER JOIN dim_tiempo t ON h.id_tiempo = t.id_tiempo
      GROUP BY t.anio, t.mes, t.nombre_mes
      ORDER BY t.anio, t.mes;
    `;

    db.all(sql, [], callback);
  },

  ventasPorCategoria: (callback) => {
    const sql = `
      SELECT
        c.nombre_categoria AS categoria,
        SUM(h.total_linea) AS totalVendido,
        SUM(h.cantidad) AS unidadesVendidas
      FROM hecho_venta h
      INNER JOIN dim_categoria c ON h.id_categoria = c.id_categoria
      GROUP BY c.nombre_categoria
      ORDER BY totalVendido DESC;
    `;

    db.all(sql, [], callback);
  },

  ventasPorTipoCliente: (callback) => {
    const sql = `
      SELECT
        ct.tipo_cliente AS tipoCliente,
        SUM(h.total_linea) AS totalVendido,
        COUNT(DISTINCT h.id_venta) AS cantidadVentas,
        SUM(h.cantidad) AS unidadesVendidas
      FROM hecho_venta h
      INNER JOIN dim_cliente_tipo ct ON h.id_cliente_tipo = ct.id_cliente_tipo
      GROUP BY ct.tipo_cliente
      ORDER BY totalVendido DESC;
    `;

    db.all(sql, [], callback);
  }
};

module.exports = AdminModel;
