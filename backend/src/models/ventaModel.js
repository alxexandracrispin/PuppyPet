const db = require("../config/database");

const VentaModel = {
  crearVenta: (venta, callback) => {
    const sql = `
      INSERT INTO venta (
        id_usuario,
        id_cliente,
        id_empresa,
        tipo_documento,
        codigo_dte,
        folio,
        subtotal,
        iva,
        total,
        estado_venta,
        xml_generado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'GENERADA', 0)
    `;

    db.run(
      sql,
      [
        venta.idUsuario,
        venta.idCliente,
        venta.idEmpresa,
        venta.tipoDocumento,
        venta.codigoDte,
        venta.folio,
        venta.subtotal,
        venta.iva,
        venta.total
      ],
      function (error) {
        callback(error, this.lastID);
      }
    );
  },

  crearDetalle: (idVenta, detalle, callback) => {
    const sql = `
      INSERT INTO detalle_venta (
        id_venta,
        id_producto,
        cantidad,
        precio_unitario,
        subtotal_linea
      )
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [
        idVenta,
        detalle.id_producto,
        detalle.cantidad,
        detalle.precio_unitario,
        detalle.subtotal_linea
      ],
      callback
    );
  },

  obtenerVentaCompleta: (idVenta, callback) => {
    const sqlVenta = `
      SELECT 
        v.*,
        u.nombre AS nombre_usuario,
        u.apellido AS apellido_usuario,

        CASE
          WHEN v.id_usuario IS NOT NULL THEN u.rut
          ELSE c.rut
        END AS rut_cliente,

        CASE
          WHEN v.id_usuario IS NOT NULL THEN u.nombre || ' ' || u.apellido
          ELSE c.razon_social
        END AS razon_social_cliente,

        CASE
          WHEN v.id_usuario IS NOT NULL THEN 'Particular'
          ELSE c.giro
        END AS giro_cliente,

        CASE
          WHEN v.id_usuario IS NOT NULL THEN u.direccion
          ELSE c.direccion
        END AS direccion_cliente,

        CASE
          WHEN v.id_usuario IS NOT NULL THEN u.comuna
          ELSE c.comuna
        END AS comuna_cliente,

        CASE
          WHEN v.id_usuario IS NOT NULL THEN u.ciudad
          ELSE c.ciudad
        END AS ciudad_cliente,
        e.rut_emisor,
        e.razon_social AS razon_social_emisor,
        e.giro_emisor,
        e.direccion_origen,
        e.comuna_origen,
        e.ciudad_origen
      FROM venta v
      LEFT JOIN usuario u ON v.id_usuario = u.id_usuario
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      INNER JOIN empresa_emisora e ON v.id_empresa = e.id_empresa
      WHERE v.id_venta = ?
    `;

    const sqlDetalles = `
      SELECT
        dv.id_detalle,
        dv.id_producto,
        p.codigo_interno,
        p.nombre_producto,
        dv.cantidad,
        dv.precio_unitario,
        dv.subtotal_linea
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `;

    db.get(sqlVenta, [idVenta], (error, venta) => {
      if (error) {
        callback(error);
        return;
      }

      if (!venta) {
        callback(null, null);
        return;
      }

      db.all(sqlDetalles, [idVenta], (errorDetalles, detalles) => {
        if (errorDetalles) {
          callback(errorDetalles);
          return;
        }

        callback(null, {
          venta,
          detalles
        });
      });
    });
  },

  obtenerVentasPorUsuario: (idUsuario, callback) => {
    const sql = `
    SELECT
      v.id_venta,
      v.id_usuario,
      v.id_cliente,
      v.id_empresa,
      v.tipo_documento,
      v.codigo_dte,
      v.folio,
      v.fecha_venta,
      v.subtotal,
      v.iva,
      v.total,
      v.estado_venta,
      v.xml_generado,
      COUNT(dv.id_detalle) AS cantidad_productos
    FROM venta v
    LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
    WHERE v.id_usuario = ?
    GROUP BY
      v.id_venta,
      v.id_usuario,
      v.id_cliente,
      v.id_empresa,
      v.tipo_documento,
      v.codigo_dte,
      v.folio,
      v.fecha_venta,
      v.subtotal,
      v.iva,
      v.total,
      v.estado_venta,
      v.xml_generado
    ORDER BY v.fecha_venta DESC
  `;

    db.all(sql, [idUsuario], callback);
  },

  marcarXmlGenerado: (idVenta, callback) => {
    const sql = `
      UPDATE venta
      SET xml_generado = 1
      WHERE id_venta = ?
    `;

    db.run(sql, [idVenta], callback);
  }
};

module.exports = VentaModel;