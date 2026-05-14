const InventarioModel = require("../models/inventarioModel");

const InventarioController = {
  obtenerProductosConStock: (req, res) => {
    InventarioModel.obtenerProductosConStock((error, productos) => {
      if (error) {
        console.error("Error al obtener productos con stock:", error);
        return res.status(500).json({
          mensaje: "Error al obtener productos con stock"
        });
      }

      res.json(productos);
    });
  },

  obtenerMovimientos: (req, res) => {
    InventarioModel.obtenerMovimientos((error, movimientos) => {
      if (error) {
        console.error("Error al obtener movimientos de inventario:", error);
        return res.status(500).json({
          mensaje: "Error al obtener movimientos de inventario"
        });
      }

      res.json(movimientos);
    });
  },

  registrarMovimiento: (req, res) => {
    const {
      idProducto,
      idUsuario,
      tipoMovimiento,
      cantidad,
      motivo,
      observacion
    } = req.body;

    if (!idProducto || !tipoMovimiento || !cantidad || !motivo) {
      return res.status(400).json({
        mensaje: "Producto, tipo de movimiento, cantidad y motivo son obligatorios"
      });
    }

    if (!["ENTRADA", "SALIDA"].includes(tipoMovimiento)) {
      return res.status(400).json({
        mensaje: "El tipo de movimiento debe ser ENTRADA o SALIDA"
      });
    }

    if (Number(cantidad) <= 0) {
      return res.status(400).json({
        mensaje: "La cantidad debe ser mayor a cero"
      });
    }

    const datosMovimiento = {
      idProducto: Number(idProducto),
      idUsuario: idUsuario ? Number(idUsuario) : null,
      tipoMovimiento,
      cantidad: Number(cantidad),
      motivo,
      observacion
    };

    InventarioModel.registrarMovimiento(datosMovimiento, (error, resultado) => {
      if (error) {
        console.error("Error al registrar movimiento:", error);
        return res.status(400).json({
          mensaje: error.message || "Error al registrar movimiento de inventario"
        });
      }

      res.status(201).json({
        mensaje: "Movimiento de inventario registrado correctamente",
        movimiento: resultado
      });
    });
  },
  actualizarUmbralesStock: (req, res) => {
  const { idProducto } = req.params;
  const { stockCritico, stockAlerta } = req.body;

  if (!idProducto) {
    return res.status(400).json({
      mensaje: "Debe indicar el producto"
    });
  }

  if (
    stockCritico === undefined ||
    stockAlerta === undefined
  ) {
    return res.status(400).json({
      mensaje: "Debe indicar stock crítico y stock de alerta"
    });
  }

  if (Number(stockCritico) < 0 || Number(stockAlerta) < 0) {
    return res.status(400).json({
      mensaje: "Los umbrales no pueden ser negativos"
    });
  }

  if (Number(stockCritico) >= Number(stockAlerta)) {
    return res.status(400).json({
      mensaje: "El stock crítico debe ser menor que el stock de alerta"
    });
  }

  const datos = {
    idProducto: Number(idProducto),
    stockCritico: Number(stockCritico),
    stockAlerta: Number(stockAlerta)
  };

  InventarioModel.actualizarUmbralesStock(datos, (error, cambios) => {
    if (error) {
      console.error("Error al actualizar umbrales:", error);
      return res.status(500).json({
        mensaje: "Error al actualizar umbrales de stock"
      });
    }

    if (cambios === 0) {
      return res.status(404).json({
        mensaje: "Producto no encontrado o inactivo"
      });
    }

    return res.json({
      mensaje: "Umbrales de stock actualizados correctamente"
    });
  });
}
};

module.exports = InventarioController;
