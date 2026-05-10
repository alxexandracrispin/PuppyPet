import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Alert,
  Spinner,
  Modal
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaReceipt, FaEye } from "react-icons/fa";

import api from "../api/api";

function MisCompras() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [compras, setCompras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [detalleVenta, setDetalleVenta] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuarioParseado = JSON.parse(usuarioGuardado);
    setUsuario(usuarioParseado);

    cargarCompras(usuarioParseado.idUsuario);
  }, [navigate]);

  const cargarCompras = async (idUsuario) => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get(`/ventas/usuario/${idUsuario}`);

      setCompras(response.data.ventas || []);
    } catch (error) {
      console.error("Error al cargar compras:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudieron cargar las compras del usuario.";

      setError(mensajeBackend);
    } finally {
      setCargando(false);
    }
  };

  const verDetalle = async (idVenta) => {
    try {
      setCargandoDetalle(true);
      setDetalleVenta(null);
      setShowModal(true);

      const response = await api.get(`/ventas/${idVenta}`);

      setDetalleVenta(response.data);
    } catch (error) {
      console.error("Error al obtener detalle de venta:", error);

      setDetalleVenta({
        error:
          error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudo obtener el detalle de la compra."
      });
    } finally {
      setCargandoDetalle(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";

    return new Date(fecha).toLocaleString("es-CL");
  };

  const formatearMonto = (monto) => {
    return Number(monto || 0).toLocaleString("es-CL");
  };

  if (!usuario) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando usuario...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="text-center mb-4">
                <FaReceipt className="registro-icon" />
                <h1 className="registro-title">Mis Compras</h1>
                <p className="registro-subtitle">
                  Revisa las compras realizadas con tu usuario.
                </p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              {cargando ? (
                <div className="text-center py-4">
                  <Spinner animation="border" />
                  <p className="mt-3">Cargando compras...</p>
                </div>
              ) : compras.length === 0 ? (
                <Alert variant="info">
                  Aún no tienes compras registradas con este usuario.
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>N° Venta</th>
                      <th>Folio</th>
                      <th>Fecha</th>
                      <th className="text-center">Productos</th>
                      <th className="text-end">Total</th>
                      <th className="text-center">XML</th>
                      <th className="text-center">Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    {compras.map((compra) => (
                      <tr key={compra.id_venta}>
                        <td>{compra.id_venta}</td>
                        <td>{compra.folio}</td>
                        <td>{formatearFecha(compra.fecha_venta)}</td>
                        <td className="text-center">
                          {compra.cantidad_productos}
                        </td>
                        <td className="text-end">
                          ${formatearMonto(compra.total)}
                        </td>
                        <td className="text-center">
                          {compra.xml_generado ? "Generado" : "Pendiente"}
                        </td>
                        <td className="text-center">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => verDetalle(compra.id_venta)}
                          >
                            <FaEye className="me-1" />
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Detalle de compra</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {cargandoDetalle ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-3">Cargando detalle...</p>
            </div>
          ) : detalleVenta?.error ? (
            <Alert variant="danger">{detalleVenta.error}</Alert>
          ) : detalleVenta ? (
            <>
              <h5>Venta N° {detalleVenta.venta.id_venta}</h5>
              <p className="mb-1">
                <strong>Folio:</strong> {detalleVenta.venta.folio}
              </p>
              <p className="mb-1">
                <strong>Fecha:</strong>{" "}
                {formatearFecha(detalleVenta.venta.fecha_venta)}
              </p>
              <p className="mb-3">
                <strong>Total:</strong> $
                {formatearMonto(detalleVenta.venta.total)}
              </p>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-end">Precio</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {detalleVenta.detalles.map((detalle) => (
                    <tr key={detalle.id_detalle}>
                      <td>{detalle.nombre_producto}</td>
                      <td className="text-center">{detalle.cantidad}</td>
                      <td className="text-end">
                        ${formatearMonto(detalle.precio_unitario)}
                      </td>
                      <td className="text-end">
                        ${formatearMonto(detalle.subtotal_linea)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="text-end">
                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    navigate(`/venta-confirmada/${detalleVenta.venta.id_venta}`)
                  }
                >
                  Ver boleta / XML
                </Button>
              </div>
            </>
          ) : (
            <Alert variant="info">No hay información para mostrar.</Alert>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MisCompras;