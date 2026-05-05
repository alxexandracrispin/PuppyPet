import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Carousel,
  Alert,
  Spinner,
  ListGroup
} from "react-bootstrap";
import { FaCartPlus, FaArrowLeft, FaStar } from "react-icons/fa";

import api from "../api/api";

function ProductoDetalle() {
  const { idProducto } = useParams();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

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

  const obtenerImagenesCarrusel = () => {
    if (!producto) return [];

    const imagenPrincipal = producto.imagen_url;

    const imagenesPorCategoria = {
      Perros: [
        imagenPrincipal,
        "/assets/images/pedi3.png",
        "/assets/images/royal3.png",
        "/assets/images/dogchow3.png"
      ],
      Gatos: [
        imagenPrincipal,
        "/assets/images/wisk3.png",
        "/assets/images/royalgato3.png",
        "/assets/images/catsh3.png"
      ],
      Snack: [
        imagenPrincipal,
        "/assets/images/snackhuesito.jpg",
        "/assets/images/snackdental.webp",
        "/assets/images/snackcarne.webp"
      ],
      Accesorios: [
        imagenPrincipal,
        "/assets/images/camaperro.webp",
        "/assets/images/transportador.jpg",
        "/assets/images/bebedero.webp"
      ],
      Higiene: [
        imagenPrincipal,
        "/assets/images/shampoperro.png",
        "/assets/images/toallahumeda.png",
        "/assets/images/cepillo.png"
      ],
      Juguetes: [
        imagenPrincipal,
        "/assets/images/pelota.png",
        "/assets/images/cuerda.png",
        "/assets/images/raton.png"
      ]
    };

    const imagenes = imagenesPorCategoria[producto.nombre_categoria] || [
      imagenPrincipal
    ];

    return [...new Set(imagenes.filter(Boolean))];
  };

  const obtenerCaracteristicas = () => {
    if (!producto) return [];

    return [
      `Categoría: ${producto.nombre_categoria}`,
      `Código interno: ${producto.codigo_interno}`,
      `Stock disponible: ${producto.stock} unidades`,
      "Producto disponible para venta online",
      "Producto sin impuesto adicional",
      "Apto para emisión de boleta XML simulada"
    ];
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
              cantidad: item.cantidad + 1,
              subtotal_linea: (item.cantidad + 1) * item.precio
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
          cantidad: 1,
          subtotal_linea: producto.precio
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

  const imagenes = obtenerImagenesCarrusel();
  const caracteristicas = obtenerCaracteristicas();

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
              <Carousel fade interval={3500}>
                {imagenes.map((imagen, index) => (
                  <Carousel.Item key={index}>
                    <img
                      src={imagen}
                      alt={`${producto.nombre_producto} ${index + 1}`}
                      className="d-block w-100 producto-detalle-img"
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
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

                <Button
                  variant="warning"
                  size="lg"
                  className="fw-bold mb-4"
                  disabled={producto.stock <= 0}
                  onClick={agregarAlCarrito}
                >
                  <FaCartPlus className="me-2" />
                  Agregar al carrito
                </Button>

                <h5 className="detalle-subtitle">Características</h5>

                <ListGroup variant="flush" className="detalle-list mb-4">
                  {caracteristicas.map((item, index) => (
                    <ListGroup.Item key={index}>{item}</ListGroup.Item>
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