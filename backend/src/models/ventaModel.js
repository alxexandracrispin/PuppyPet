const db = require("../config/database");

const VentaModel = {

  // Inserta el encabezado de una venta nueva en la tabla venta.
  // Las fechas se registran automáticamente con CURRENT_TIMESTAMP
  crearVenta: (venta, callback) => {
    const sql = `
      INSERT INTO venta (
        id_usuario, id_cliente, id_empresa,
        tipo_documento, codigo_dte, folio,
        fecha_venta, fecha_emision,
        subtotal, iva, total, estado_venta, xml_generado
      )
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?, ?, ?, 'GENERADA', 0)
    `;
    db.run(sql, [
      venta.idUsuario, venta.idCliente, venta.idEmpresa,
      venta.tipoDocumento, venta.codigoDte, venta.folio,
      venta.subtotal, venta.iva, venta.total
    ], function (error) {
      callback(error, this.lastID); // lastID retorna el ID de la venta recién creada
    });
  },

  // Inserta una línea de producto dentro de una venta existente
  crearDetalle: (idVenta, detalle, callback) => {
    const sql = `
      INSERT INTO detalle_venta (
        id_venta, id_producto, cantidad, precio_unitario, subtotal_linea
      ) VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sql, [
      idVenta, detalle.id_producto, detalle.cantidad,
      detalle.precio_unitario, detalle.subtotal_linea
    ], callback);
  },

  // Obtiene los datos completos de una venta para generar la boleta.
  // Usa CASE WHEN para mostrar los datos del usuario registrado o del consumidor final
  // dependiendo si la compra fue hecha con sesión iniciada o como invitado
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
        e.rut_emisor, e.razon_social AS razon_social_emisor,
        e.giro_emisor, e.direccion_origen, e.comuna_origen, e.ciudad_origen
      FROM venta v
      LEFT JOIN usuario u ON v.id_usuario = u.id_usuario   -- LEFT JOIN: la venta puede no tener usuario registrado
      LEFT JOIN cliente c ON v.id_cliente = c.id_cliente
      INNER JOIN empresa_emisora e ON v.id_empresa = e.id_empresa
      WHERE v.id_venta = ?
    `;

    const sqlDetalles = `
      SELECT
        dv.id_detalle, dv.id_producto,
        p.codigo_interno, p.nombre_producto,
        dv.cantidad, dv.precio_unitario, dv.subtotal_linea
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `;

    // Primero se obtiene el encabezado de la venta
    db.get(sqlVenta, [idVenta], (error, venta) => {
      if (error) return callback(error);
      if (!venta) return callback(null, null);

      // Luego se obtienen los productos para armar la respuesta completa
      db.all(sqlDetalles, [idVenta], (errorDetalles, detalles) => {
        if (errorDetalles) return callback(errorDetalles);
        callback(null, { venta, detalles });
      });
    });
  },

  // Obtiene el historial de compras de un usuario registrado,
  // incluyendo la cantidad de productos por cada venta
  obtenerVentasPorUsuario: (idUsuario, callback) => {
    const sql = `
      SELECT
        v.id_venta, v.id_usuario, v.id_cliente, v.id_empresa,
        v.tipo_documento, v.codigo_dte, v.folio, v.fecha_venta,
        v.subtotal, v.iva, v.total, v.estado_venta, v.xml_generado,
        COUNT(dv.id_detalle) AS cantidad_productos
      FROM venta v
      LEFT JOIN detalle_venta dv ON v.id_venta = dv.id_venta
      WHERE v.id_usuario = ?
      GROUP BY v.id_venta, v.id_usuario, v.id_cliente, v.id_empresa,
               v.tipo_documento, v.codigo_dte, v.folio, v.fecha_venta,
               v.subtotal, v.iva, v.total, v.estado_venta, v.xml_generado
      ORDER BY v.fecha_venta DESC
    `;
    db.all(sql, [idUsuario], callback);
  },

  // Alimenta el modelo estrella del dashboard BI al confirmar una venta.
  // Se ejecutan 5 consultas en orden: las dimensiones primero, la tabla de hechos al final
  registrarHechosVenta: (idVenta, callback) => {

    // INSERT OR IGNORE: inserta solo si el registro no existe previamente en la dimensión
    const sqlDimCategoria = `
      INSERT OR IGNORE INTO dim_categoria (id_categoria, nombre_categoria)
      SELECT DISTINCT c.id_categoria, c.nombre_categoria
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      INNER JOIN categoria c ON p.id_categoria = c.id_categoria
      WHERE dv.id_venta = ?
    `;

    const sqlDimProducto = `
      INSERT OR IGNORE INTO dim_producto (
        id_producto, codigo_interno, nombre_producto, precio_referencia, estado
      )
      SELECT DISTINCT p.id_producto, p.codigo_interno, p.nombre_producto, p.precio, p.estado
      FROM detalle_venta dv
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `;

    // STRFTIME extrae partes de la fecha (día, mes, año) para poblar la dimensión tiempo
    const sqlDimTiempo = `
      INSERT OR IGNORE INTO dim_tiempo (fecha, dia, mes, anio, nombre_mes)
      SELECT DISTINCT
        DATE(v.fecha_venta) AS fecha,
        CAST(STRFTIME('%d', v.fecha_venta) AS INTEGER) AS dia,
        CAST(STRFTIME('%m', v.fecha_venta) AS INTEGER) AS mes,
        CAST(STRFTIME('%Y', v.fecha_venta) AS INTEGER) AS anio,
        CASE STRFTIME('%m', v.fecha_venta)
          WHEN '01' THEN 'Enero'     WHEN '02' THEN 'Febrero'
          WHEN '03' THEN 'Marzo'     WHEN '04' THEN 'Abril'
          WHEN '05' THEN 'Mayo'      WHEN '06' THEN 'Junio'
          WHEN '07' THEN 'Julio'     WHEN '08' THEN 'Agosto'
          WHEN '09' THEN 'Septiembre' WHEN '10' THEN 'Octubre'
          WHEN '11' THEN 'Noviembre' WHEN '12' THEN 'Diciembre'
        END AS nombre_mes
      FROM venta v WHERE v.id_venta = ?
    `;

    // Se eliminan hechos previos para evitar duplicados si la venta se regenera
    const sqlEliminarHechosPrevios = `DELETE FROM hecho_venta WHERE id_venta = ?`;

    // Inserta los hechos relacionando todas las dimensiones.
    // El IVA por línea se calcula como la diferencia entre el total y el neto
    const sqlHechos = `
      INSERT INTO hecho_venta (
        id_venta, id_producto, id_categoria, id_tiempo, id_cliente_tipo,
        cantidad, precio_unitario, subtotal_linea, iva_linea, total_linea
      )
      SELECT
        v.id_venta, p.id_producto, p.id_categoria, t.id_tiempo,
        CASE
          WHEN v.id_usuario IS NOT NULL THEN 1  -- 1 = cliente registrado
          ELSE 2                                 -- 2 = invitado / consumidor final
        END AS id_cliente_tipo,
        dv.cantidad, dv.precio_unitario, dv.subtotal_linea,
        ROUND(dv.subtotal_linea - (dv.subtotal_linea / 1.19), 0) AS iva_linea,
        dv.subtotal_linea AS total_linea
      FROM detalle_venta dv
      INNER JOIN venta v    ON dv.id_venta    = v.id_venta
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      INNER JOIN dim_tiempo t ON t.fecha = DATE(v.fecha_venta)
      WHERE v.id_venta = ?
    `;

    // Las consultas se encadenan: cada una espera que la anterior termine antes de ejecutarse
    db.run(sqlDimCategoria, [idVenta], (errorCategoria) => {
      if (errorCategoria) return callback(errorCategoria);
      db.run(sqlDimProducto, [idVenta], (errorProducto) => {
        if (errorProducto) return callback(errorProducto);
        db.run(sqlDimTiempo, [idVenta], (errorTiempo) => {
          if (errorTiempo) return callback(errorTiempo);
          db.run(sqlEliminarHechosPrevios, [idVenta], (errorEliminar) => {
            if (errorEliminar) return callback(errorEliminar);
            db.run(sqlHechos, [idVenta], callback);
          });
        });
      });
    });
  },

  // Marca la venta como XML generado una vez que el documento fue creado y almacenado
  marcarXmlGenerado: (idVenta, callback) => {
    const sql = `UPDATE venta SET xml_generado = 1 WHERE id_venta = ?`;
    db.run(sql, [idVenta], callback);
  }
};

module.exports = VentaModel;
