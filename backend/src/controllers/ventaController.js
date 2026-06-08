const db = require("../config/database");

const ProductoModel     = require("../models/productoModel");
const VentaModel        = require("../models/ventaModel");
const DocumentoXmlModel = require("../models/documentoXmlModel");

const { generarXmlBoleta } = require("../services/generadorXmlService");

// Calcula subtotal (sin IVA), IVA y total desde los ítems del carrito.
// El total ya incluye IVA; el subtotal se obtiene dividiendo por 1.19
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

  // Orquesta el flujo completo de una compra dentro de una transacción SQLite:
  // 1. Valida sesión si hay usuario, 2. Crea la venta, 3. Inserta cada detalle,
  // 4. Descuenta stock, 5. Alimenta el modelo estrella BI, 6. Genera y guarda el XML.
  // Si algún paso falla, se ejecuta ROLLBACK para revertir todos los cambios
  confirmarVentaDirecta: (req, res) => {
    const {
      idUsuario,
      idCliente,
      idEmpresa,
      tipoCliente,
      tipoEntrega,
      items
    } = req.body || {};

    if (!items || items.length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar productos para confirmar la venta"
      });
    }

    if (!idUsuario && tipoEntrega && tipoEntrega !== "RETIRO_TIENDA") {
      return res.status(400).json({
        mensaje: "Las compras como invitado solo permiten retiro en tienda"
      });
    }

    const totales = calcularTotalesDesdeItems(items);

    const venta = {
      idUsuario: idUsuario || null,
      idCliente: idCliente || 1,
      idEmpresa: idEmpresa || 1,
      tipoCliente: tipoCliente || (idUsuario ? "REGISTRADO" : "INVITADO"),
      tipoEntrega: tipoEntrega || "RETIRO_TIENDA",
      tipoDocumento: "BOLETA",
      codigoDte: 39,
      folio: Date.now(),
      subtotal: totales.subtotal,
      iva: totales.iva,
      total: totales.total
    };

    const procesarVenta = () => {
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
              id_producto:    item.idProducto,
              cantidad:       item.cantidad,
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

                  // Solo cuando todos los ítems fueron procesados se continúa con BI y XML
                  if (procesados === items.length) {
                    VentaModel.registrarHechosVenta(idVenta, (errorHechos) => {
                      if (errorHechos) {
                        db.run("ROLLBACK");
                        return res.status(500).json({
                          mensaje: "Error al registrar hechos de venta para el dashboard",
                          error: errorHechos.message
                        });
                      }

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

                          // Se genera el XML de la boleta electrónica a partir de los datos de la venta
                          const contenidoXml  = generarXmlBoleta(dataVenta);
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

                                  // Se confirma la transacción solo cuando todo el flujo fue exitoso
                                  db.run("COMMIT");

                                  return res.status(201).json({
                                    mensaje: "Venta confirmada y XML generado correctamente",
                                    idVenta,
                                    idDocumentoXml,
                                    nombreArchivo,
                                    venta:    dataVenta.venta,
                                    detalles: dataVenta.detalles,
                                    xml:      contenidoXml
                                  });
                                }
                              );
                            }
                          );
                        }
                      );
                    });
                  }
                }
              );
            });
          });
        });
      });
    };

    // Si hay usuario activo se verifica que su sesión sea válida antes de procesar la venta
    if (idUsuario) {
      db.get(
        "SELECT id_usuario FROM usuario WHERE id_usuario = ?",
        [idUsuario],
        (errUser, usuarioRow) => {
          if (errUser) {
            return res.status(500).json({
              mensaje: "Error al validar sesión",
              error: errUser.message
            });
          }
          if (!usuarioRow) {
            return res.status(401).json({
              mensaje: "Sesión inválida. Por favor inicia sesión nuevamente."
            });
          }
          procesarVenta();
        }
      );
    } else {
      procesarVenta();
    }
  },

  // Retorna la venta completa (encabezado + detalles) para visualizar la boleta
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

  // Retorna el historial de compras de un usuario registrado ordenado por fecha
  obtenerVentasPorUsuario: (req, res) => {
    const { idUsuario } = req.params;

    if (!idUsuario) {
      return res.status(400).json({
        mensaje: "Debe indicar el ID del usuario"
      });
    }

    VentaModel.obtenerVentasPorUsuario(idUsuario, (error, ventas) => {
      if (error) {
        return res.status(500).json({
          mensaje: "Error al obtener compras del usuario",
          error: error.message
        });
      }

      return res.status(200).json({
        mensaje: "Compras obtenidas correctamente",
        ventas
      });
    });
  },

  // Retorna el contenido XML de la boleta electrónica de una venta.
  // Se envía con Content-Type application/xml para que el navegador lo descargue correctamente
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
