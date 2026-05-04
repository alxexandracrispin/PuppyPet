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
        c.rut AS rut_cliente,
        c.razon_social AS razon_social_cliente,
        c.giro AS giro_cliente,
        c.direccion AS direccion_cliente,
        c.comuna AS comuna_cliente,
        c.ciudad AS ciudad_cliente,
        e.rut_emisor,
        e.razon_social AS razon_social_emisor,
        e.giro_emisor,
        e.direccion_origen,
        e.comuna_origen,
        e.ciudad_origen
      FROM venta v
      INNER JOIN usuario u ON v.id_usuario = u.id_usuario
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