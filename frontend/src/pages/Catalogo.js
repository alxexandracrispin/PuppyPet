import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Alert, Spinner } from "react-bootstrap";

import api from "../api/api";
import ProductoCard from "../components/ProductoCard";

function Catalogo() {
    const { categoria } = useParams();

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        cargarProductos();
    }, [categoria]);

    const cargarProductos = async () => {
        try {
            setCargando(true);
            setError("");

            const endpoint = categoria
                ? `/productos/categoria/${categoria}`
                : "/productos";

            const response = await api.get(endpoint);
            setProductos(response.data);
        } catch (error) {
            setError("No se pudieron cargar los productos desde la API.");
        } finally {
            setCargando(false);
        }
    };

    const agregarAlCarrito = (producto) => {
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

    const obtenerTituloCategoria = () => {
        if (!categoria) {
            return {
                titulo: "Catálogo de productos",
                subtitulo: "Encuentra productos para el cuidado de tus mascotas"
            };
        }

        const textos = {
            Perros: {
                titulo: "Comida para Perros",
                subtitulo: "Encuentra los mejores alimentos para tu mascota"
            },
            Gatos: {
                titulo: "Comida para Gatos",
                subtitulo: "Encuentra los mejores alimentos para tu gato"
            },
            Snack: {
                titulo: "Snack para Mascotas",
                subtitulo: "Premios y snacks para regalonear a tus mascotas"
            },
            Accesorios: {
                titulo: "Accesorios",
                subtitulo: "Productos prácticos para el cuidado diario"
            },
            Higiene: {
                titulo: "Higiene para Mascotas",
                subtitulo: "Todo para mantener a tu mascota limpia y saludable"
            },
            Juguetes: {
                titulo: "Juguetes para Mascotas",
                subtitulo: "Diversión asegurada para tu mejor amigo"
            }
        };

        return textos[categoria] || {
            titulo: `Catálogo: ${categoria}`,
            subtitulo: "Productos disponibles"
        };
    };
    const encabezado = obtenerTituloCategoria();

    return (
        <Container className="py-5">
            <div className="catalogo-wrapper">
                <div className="text-center mb-5">
                    <h1 className="section-title mb-2">{encabezado.titulo}</h1>
                    <p className="lead">{encabezado.subtitulo}</p>
                </div>

                {cargando && (
                    <div className="text-center py-5">
                        <Spinner animation="border" />
                        <p className="mt-3">Cargando productos...</p>
                    </div>
                )}

                {error && (
                    <Alert variant="danger">
                        {error}
                    </Alert>
                )}

                {!cargando && !error && productos.length === 0 && (
                    <Alert variant="warning">
                        No hay productos disponibles para esta categoría.
                    </Alert>
                )}

                {!cargando && !error && productos.length > 0 && (
                    <Row>
                        {productos.map((producto) => (
                            <Col md={4} lg={3} className="mb-4" key={producto.id_producto}>
                                <ProductoCard
                                    producto={producto}
                                    onAgregar={agregarAlCarrito}
                                />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </Container>
    );
}

export default Catalogo;