const db = require("../config/database");

const ProductoModel = require("../models/productoModel");
const VentaModel = require("../models/ventaModel");
const DocumentoXmlModel = require("../models/documentoXmlModel");

const { generarXmlBoleta } = require("../services/generadorXmlService");

function calcularTotalesDesdeItems(items) {
  const total = items.reduce((acumulador, item) => {
    return acumulador + item.subtotalLinea;
  }, 0);

  const subtotal = Math.round(total / 1.19);
  const iva = total - subtotal;

  return {
    subtotal,
    iva,
    total
  };
}

const VentaController = {
  confirmarVentaDirecta: (req, res) => {
    const { idUsuario, idCliente, idEmpresa, items } = req.body || {};

    if (!items || items.length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar productos para confirmar la venta"
      });
    }

    const totales = calcularTotalesDesdeItems(items);

    const venta = {
      idUsuario: idUsuario || 1,
      idCliente: idCliente || 1,
      idEmpresa: idEmpresa || 1,
      tipoDocumento: "BOLETA",
      codigoDte: 39,
      folio: Date.now(),
      subtotal: totales.subtotal,
      iva: totales.iva,
      total: totales.total
    };

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      VentaModel.crearVenta(venta, (errorVenta, idVenta) => {
        if (errorVenta) {
          db.run("ROLLBACK");
          return res.status(500).json({
            mensaje: "Error al crear venta",
            error: errorVenta.message
          });
        }

        let procesados = 0;
        let errorDetectado = false;

        items.forEach((item) => {
          const detalle = {
            id_producto: item.idProducto,
            cantidad: item.cantidad,
            precio_unitario: item.precioUnitario,
            subtotal_linea: item.subtotalLinea
          };

          VentaModel.crearDetalle(idVenta, detalle, (errorDetalle) => {
            if (errorDetectado) return;

            if (errorDetalle) {
              errorDetectado = true;

              db.run("ROLLBACK");
              return res.status(500).json({
                mensaje: "Error al crear detalle de venta",
                error: errorDetalle.message
              });
            }

            ProductoModel.descontarStock(
              item.idProducto,
              item.cantidad,
              (errorStock, resultadoStock) => {
                if (errorDetectado) return;

                if (errorStock || resultadoStock.changes === 0) {
                  errorDetectado = true;

                  db.run("ROLLBACK");
                  return res.status(400).json({
                    mensaje: "Error al descontar stock o stock insuficiente"
                  });
                }

                procesados++;

                if (procesados === items.length) {
                  VentaModel.obtenerVentaCompleta(
                    idVenta,
                    (errorVentaCompleta, dataVenta) => {
                      if (errorVentaCompleta) {
                        db.run("ROLLBACK");
                        return res.status(500).json({
                          mensaje: "Error al obtener venta completa",
                          error: errorVentaCompleta.message
                        });
                      }

                      if (!dataVenta) {
                        db.run("ROLLBACK");
                        return res.status(404).json({
                          mensaje: "No se encontró la venta generada"
                        });
                      }

                      const contenidoXml = generarXmlBoleta(dataVenta);
                      const nombreArchivo = `boleta_${idVenta}.xml`;

                      DocumentoXmlModel.guardarXml(
                        idVenta,
                        nombreArchivo,
                        contenidoXml,
                        (errorXml, idDocumentoXml) => {
                          if (errorXml) {
                            db.run("ROLLBACK");
                            return res.status(500).json({
                              mensaje: "Error al guardar XML",
                              error: errorXml.message
                            });
                          }

                          VentaModel.marcarXmlGenerado(
                            idVenta,
                            (errorMarcarXml) => {
                              if (errorMarcarXml) {
                                db.run("ROLLBACK");
                                return res.status(500).json({
                                  mensaje: "Error al marcar XML generado",
                                  error: errorMarcarXml.message
                                });
                              }

                              db.run("COMMIT");

                              return res.status(201).json({
                                mensaje:
                                  "Venta confirmada y XML generado correctamente",
                                idVenta,
                                idDocumentoXml,
                                nombreArchivo,
                                venta: dataVenta.venta,
                                detalles: dataVenta.detalles,
                                xml: contenidoXml
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              }
            );
          });
        });
      });
    });
  },

  obtenerVenta: (req, res) => {
    const { idVenta } = req.params;

    VentaModel.obtenerVentaCompleta(idVenta, (error, data) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener venta",
          error: error.message
        });
      }

      if (!data) {
        return res.status(404).json({
          mensaje: "Venta no encontrada"
        });
      }

      return res.json(data);
    });
  },

  obtenerXml: (req, res) => {
    const { idVenta } = req.params;

    DocumentoXmlModel.obtenerPorVenta(idVenta, (error, documento) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener XML",
          error: error.message
        });
      }

      if (!documento) {
        return res.status(404).json({
          mensaje: "XML no encontrado para esta venta"
        });
      }

      res.setHeader("Content-Type", "application/xml");
      return res.send(documento.contenido_xml);
    });
  }
};

module.exports = VentaController;