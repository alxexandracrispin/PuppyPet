const db = require("../config/database");

const DocumentoXmlModel = {
  guardarXml: (idVenta, nombreArchivo, contenidoXml, callback) => {
    const sql = `
      INSERT INTO documento_xml (
        id_venta,
        nombre_archivo,
        contenido_xml,
        estado_xml
      )
      VALUES (?, ?, ?, 'GENERADO')
    `;

    db.run(sql, [idVenta, nombreArchivo, contenidoXml], function (error) {
      callback(error, this.lastID);
    });
  },

  obtenerPorVenta: (idVenta, callback) => {
    const sql = `
      SELECT *
      FROM documento_xml
      WHERE id_venta = ?
      ORDER BY fecha_generacion DESC
      LIMIT 1
    `;

    db.get(sql, [idVenta], callback);
  }
};

module.exports = DocumentoXmlModel;