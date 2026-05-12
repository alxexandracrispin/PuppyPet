import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Alert,
  Spinner,
  ListGroup,
  Form
} from "react-bootstrap";
import { FaCartPlus, FaArrowLeft, FaStar } from "react-icons/fa";

import api from "../api/api";

function ProductoDetalle() {
  const { idProducto } = useParams();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    cargarProducto();
  }, [idProducto]);

  const cargarProducto = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get(`/productos/${idProducto}`);
      setProducto(response.data);
    } catch (error) {
      setError("No se pudo cargar el detalle del producto.");
    } finally {
      setCargando(false);
    }
  };

  const manejarCambioCantidad = (event) => {
    const nuevaCantidad = Number(event.target.value);

    if (nuevaCantidad < 1) {
      setCantidad(1);
      return;
    }

    if (producto?.stock && nuevaCantidad > producto.stock) {
      setCantidad(producto.stock);
      return;
    }

    setCantidad(nuevaCantidad);
  };

  const agregarAlCarrito = () => {
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];

    const productoExistente = carritoActual.find(
      (item) => item.id_producto === producto.id_producto
    );

    let nuevoCarrito;

    if (productoExistente) {
      nuevoCarrito = carritoActual.map((item) =>
        item.id_producto === producto.id_producto
          ? {
              ...item,
              cantidad: item.cantidad + cantidad,
              subtotal_linea: (item.cantidad + cantidad) * item.precio,
              stock: producto.stock
            }
          : item
      );
    } else {
      nuevoCarrito = [
        ...carritoActual,
        {
          id_producto: producto.id_producto,
          nombre_producto: producto.nombre_producto,
          precio: producto.precio,
          cantidad: cantidad,
          subtotal_linea: producto.precio * cantidad,
          stock: producto.stock
        }
      ];
    }

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    alert("Producto agregado al carrito");
  };

  if (cargando) {
    return (
      <Container className="py-5">
        <div className="catalogo-wrapper text-center">
          <Spinner animation="border" variant="warning" />
          <p className="mt-3">Cargando detalle del producto...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!producto) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Producto no encontrado.</Alert>
      </Container>
    );
  }

  const caracteristicas = [
    `Categoría: ${producto.nombre_categoria}`,
    `Código interno: ${producto.codigo_interno}`,
    `Stock disponible: ${producto.stock} unidades`,
    "Producto disponible para venta online",
    "Producto sin impuesto adicional",
    "Apto para emisión de boleta XML simulada"
  ];

  return (
    <Container className="py-5">
      <div className="producto-detalle-wrapper">
        <Button
          as={Link}
          to={`/catalogo/${producto.nombre_categoria}`}
          variant="outline-light"
          className="mb-4"
        >
          <FaArrowLeft className="me-2" />
          Volver al catálogo
        </Button>

        <Row className="g-4">
          <Col lg={6}>
            <Card className="producto-detalle-card">
              <img
                src={producto.imagen_url}
                alt={producto.nombre_producto}
                className="d-block w-100 producto-detalle-img"
              />
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="producto-detalle-card h-100">
              <Card.Body>
                <Badge bg="warning" text="dark" className="mb-3">
                  {producto.nombre_categoria}
                </Badge>

                <h1 className="producto-detalle-title">
                  {producto.nombre_producto}
                </h1>

                <p className="producto-detalle-description">
                  {producto.descripcion}
                </p>

                <p className="producto-detalle-price">
                  ${producto.precio.toLocaleString("es-CL")}
                </p>

                <p className="producto-detalle-stock">
                  Stock disponible: {producto.stock}
                </p>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white">Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max={producto.stock}
                    value={cantidad}
                    onChange={manejarCambioCantidad}
                    style={{ width: "120px" }}
                  />
                  <Form.Text className="text-light">
                    Máximo disponible: {producto.stock}
                  </Form.Text>
                </Form.Group>

                <Button
                  variant="warning"
                  size="lg"
                  className="fw-bold mb-4"
                  onClick={agregarAlCarrito}
                  disabled={producto.stock <= 0}
                >
                  <FaCartPlus className="me-2" />
                  Agregar al carrito
                </Button>

                <h5 className="detalle-subtitle">Características</h5>

                <ListGroup variant="flush" className="detalle-list mb-4">
                  {caracteristicas.map((item, index) => (
                    <ListGroup.Item key={index}>
                      {item}
                    </ListGroup.Item>
                  ))}
                </ListGroup>

                <h5 className="detalle-subtitle">Comentarios</h5>

                <div className="comentario-box">
                  <div className="comentario-stars">
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                    <FaStar />
                  </div>

                  <p className="mb-1">
                    Producto bien valorado por clientes de PuppyPet.
                  </p>

                  <small>
                    Comentario referencial para presentación académica.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default ProductoDetalle;