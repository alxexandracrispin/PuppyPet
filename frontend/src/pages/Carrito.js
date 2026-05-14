import { useEffect, useState } from "react";
import { Container, Table, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

function Carrito() {
  const [items, setItems] = useState([]);
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    cargarCarrito();
  }, []);

  const cargarCarrito = () => {
    const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];
    setItems(carritoGuardado);
  };

  const calcularTotal = () => {
    return items.reduce((total, item) => total + item.subtotal_linea, 0);
  };

  const calcularSubtotal = () => {
    return Math.round(calcularTotal() / 1.19);
  };

  const calcularIva = () => {
    return calcularTotal() - calcularSubtotal();
  };

const aumentarCantidad = (idProducto) => {
  const nuevoCarrito = items.map((item) => {
    if (item.id_producto === idProducto) {
      const nuevaCantidad = item.cantidad + 1;

      return {
        ...item,
        cantidad: nuevaCantidad,
        subtotal_linea: nuevaCantidad * item.precio
      };
    }

    return item;
  });

  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  setItems(nuevoCarrito);

  window.dispatchEvent(new Event("carritoActualizado"));
};

const disminuirCantidad = (idProducto) => {
  const nuevoCarrito = items.map((item) => {
    if (item.id_producto === idProducto) {
      const nuevaCantidad = item.cantidad - 1;

      return {
        ...item,
        cantidad: nuevaCantidad,
        subtotal_linea: nuevaCantidad * item.precio
      };
    }

    return item;
  });

  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  setItems(nuevoCarrito);

  window.dispatchEvent(new Event("carritoActualizado"));
};

const eliminarItem = (idProducto) => {
  const nuevoCarrito = items.filter(
    (item) => item.id_producto !== idProducto
  );

  localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  setItems(nuevoCarrito);

  window.dispatchEvent(new Event("carritoActualizado"));
};

  const vaciarCarrito = () => {
    localStorage.removeItem("carrito");
    setItems([]);
  };

  const confirmarVenta = async () => {
    try {
      setProcesando(true);
      setError("");

      if (items.length === 0) {
        setError("El carrito está vacío.");
        return;
      }

      const usuarioGuardado = localStorage.getItem("usuario");
      const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

      const payload = {
        idUsuario: usuario ? usuario.idUsuario : null,
        idCliente: 1,
        idEmpresa: 1,
        tipoCliente: usuario ? "REGISTRADO" : "INVITADO",
        tipoEntrega: "RETIRO_TIENDA",
        items: items.map((item) => ({
          idProducto: item.id_producto,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
          subtotalLinea: item.subtotal_linea
        }))
      };

      const response = await api.post("/ventas/confirmar-directa", payload);

      localStorage.removeItem("carrito");

      navigate(`/venta-confirmada/${response.data.idVenta}`, {
        state: {
          venta: response.data
        }
      });

    } catch (error) {
      console.error("Error al confirmar venta:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo confirmar la venta.";

      setError(mensajeBackend);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Carrito de compras</h1>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}
      {!localStorage.getItem("usuario") && items.length > 0 && (
        <Alert variant="warning">
          Estás comprando como invitado. La boleta se emitirá como consumidor final
          con RUT 66.666.666-6 y la entrega quedará disponible solo para retiro en tienda.
        </Alert>
      )}

      {localStorage.getItem("usuario") && items.length > 0 && (
        <Alert variant="success">
          La compra quedará asociada a tu usuario y podrás verla posteriormente en
          tu historial de compras.
        </Alert>
      )}

      {items.length === 0 ? (
        <Alert variant="info">
          El carrito está vacío.
        </Alert>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-end">Precio</th>
                <th className="text-end">Subtotal</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id_producto}>
                  <td>{item.nombre_producto}</td>
                  <td className="text-center">
  <div className="d-flex justify-content-center align-items-center gap-2">

    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => disminuirCantidad(item.id_producto)}
      disabled={item.cantidad <= 1}
    >
      -
    </Button>

    <span className="fw-bold">{item.cantidad}</span>

    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => aumentarCantidad(item.id_producto)}
    >
      +
    </Button>

  </div>
</td>
                  <td className="text-end">
                    ${item.precio.toLocaleString("es-CL")}
                  </td>
                  <td className="text-end">
                    ${item.subtotal_linea.toLocaleString("es-CL")}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => eliminarItem(item.id_producto)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Row className="justify-content-end">
            <Col md={5}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5>Resumen de venta</h5>

                  <div className="d-flex justify-content-between">
                    <span>Neto:</span>
                    <strong>${calcularSubtotal().toLocaleString("es-CL")}</strong>
                  </div>

                  <div className="d-flex justify-content-between">
                    <span>IVA:</span>
                    <strong>${calcularIva().toLocaleString("es-CL")}</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fs-5">
                    <span>Total:</span>
                    <strong>${calcularTotal().toLocaleString("es-CL")}</strong>
                  </div>

                  <div className="d-grid gap-2 mt-4">
                    <Button
                      variant="success"
                      onClick={confirmarVenta}
                      disabled={procesando}
                    >
                      {procesando
                        ? "Procesando..."
                        : "Confirmar venta y generar XML"}
                    </Button>

                    <Button
                      variant="outline-secondary"
                      onClick={vaciarCarrito}
                    >
                      Vaciar carrito
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

export default Carrito;