import { useEffect, useState } from "react";
import {
    Alert,
    Badge,
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    Row,
    Spinner,
    Table
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
    FaArrowDown,
    FaArrowUp,
    FaBoxOpen,
    FaChartBar,
    FaHome,
    FaPaw,
    FaSignOutAlt
} from "react-icons/fa";
import api from "../../api/api";
import "../AdminDashboard.css";
import "./AdminInventario.css";

function AdminInventario() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [productos, setProductos] = useState([]);
    const [movimientos, setMovimientos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [errorModal, setErrorModal] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [tipoMovimiento, setTipoMovimiento] = useState("ENTRADA");
    const [cantidad, setCantidad] = useState("");
    const [motivo, setMotivo] = useState("");
    const [observacion, setObservacion] = useState("");

    const [mostrarModalUmbrales, setMostrarModalUmbrales] = useState(false);
    const [stockCritico, setStockCritico] = useState("");
    const [stockAlerta, setStockAlerta] = useState("");

    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");

        if (!usuarioGuardado) {
            navigate("/login");
            return;
        }

        const usuarioParseado = JSON.parse(usuarioGuardado);

        if (usuarioParseado.rol !== "ADMIN") {
            navigate("/");
            return;
        }

        setUsuario(usuarioParseado);
    }, [navigate]);

    const cargarDatos = async () => {
        try {
            setCargando(true);
            setError("");

            const [responseProductos, responseMovimientos] = await Promise.all([
                api.get("/admin/inventario/productos"),
                api.get("/admin/inventario/movimientos")
            ]);

            setProductos(responseProductos.data || []);
            setMovimientos(responseMovimientos.data || []);
        } catch (errorCarga) {
            console.error("Error al cargar inventario:", errorCarga);
            setError("No se pudo cargar la información de inventario.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        if (usuario) {
            cargarDatos();
        }
    }, [usuario]);

    const abrirModal = (producto, tipo) => {
        setProductoSeleccionado(producto);
        setTipoMovimiento(tipo);
        setCantidad("");
        setMotivo("");
        setObservacion("");
        setMensaje("");
        setError("");
        setErrorModal("");
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setProductoSeleccionado(null);
        setErrorModal("");
    };
    const registrarMovimiento = async (evento) => {
        evento.preventDefault();

        if (!cantidad || Number(cantidad) <= 0) {
            setErrorModal("La cantidad debe ser mayor a cero.");
            return;
        }

        if (!motivo.trim()) {
            setErrorModal("El motivo es obligatorio.");
            return;
        }

        try {
            setError("");
            setErrorModal("");
            setMensaje("");

            await api.post("/admin/inventario/movimiento", {
                idProducto: productoSeleccionado.id_producto,
                idUsuario: usuario.id_usuario,
                tipoMovimiento,
                cantidad: Number(cantidad),
                motivo,
                observacion
            });

            setMensaje("Movimiento registrado correctamente.");
            cerrarModal();
            cargarDatos();

        }
        catch (errorMovimiento) {
            console.error("Error al registrar movimiento:", errorMovimiento);
            setErrorModal(
                errorMovimiento.response?.data?.mensaje ||
                "No se pudo registrar el movimiento."
            );
        }
    };

    const abrirModalUmbrales = (producto) => {
        setProductoSeleccionado(producto);
        setStockCritico(producto.stock_critico ?? 5);
        setStockAlerta(producto.stock_alerta ?? 10);
        setErrorModal("");
        setMensaje("");
        setError("");
        setMostrarModalUmbrales(true);
    };

    const cerrarModalUmbrales = () => {
        setMostrarModalUmbrales(false);
        setProductoSeleccionado(null);
        setErrorModal("");
    };

    const guardarUmbralesStock = async (evento) => {
        evento.preventDefault();

        if (Number(stockCritico) < 0 || Number(stockAlerta) < 0) {
            setErrorModal("Los umbrales no pueden ser negativos.");
            return;
        }

        if (Number(stockCritico) >= Number(stockAlerta)) {
            setErrorModal("El stock crítico debe ser menor que el stock de alerta.");
            return;
        }

        try {
            setError("");
            setErrorModal("");
            setMensaje("");

            await api.put(
                `/admin/inventario/productos/${productoSeleccionado.id_producto}/umbrales`,
                {
                    stockCritico: Number(stockCritico),
                    stockAlerta: Number(stockAlerta)
                }
            );

            setMensaje("Semáforo de stock actualizado correctamente.");
            cerrarModalUmbrales();
            cargarDatos();
        } catch (errorUmbrales) {
            console.error("Error al actualizar umbrales:", errorUmbrales);
            setErrorModal(
                errorUmbrales.response?.data?.mensaje ||
                "No se pudo actualizar el semáforo de stock."
            );
        }
    };

    const obtenerBadgeStock = (producto) => {
        if (producto.estado_stock === "ROJO") {
            return "danger";
        }

        if (producto.estado_stock === "AMARILLO") {
            return "warning";
        }

        return "success";
    };

    const obtenerTextoStock = (producto) => {
        if (producto.estado_stock === "ROJO") {
            return "Stock crítico";
        }

        if (producto.estado_stock === "AMARILLO") {
            return "Cercano al crítico";
        }

        return "Stock ideal";
    };

    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        window.dispatchEvent(new Event("usuarioActualizado"));
        navigate("/login");
    };

    if (!usuario) return null;

    return (
        <div className="admin-shell">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <FaPaw />
                    <span>PuppyPet Admin</span>
                </div>

                <nav>
                    <button type="button" onClick={() => navigate("/admin")}>
                        <FaChartBar /> Dashboard BI
                    </button>

                    <button className="active" type="button">
                        <FaBoxOpen /> Inventario
                    </button>

                    <button type="button" onClick={() => navigate("/")}>
                        <FaHome /> Volver a tienda
                    </button>

                    <button type="button" onClick={cerrarSesion}>
                        <FaSignOutAlt /> Cerrar sesión
                    </button>
                </nav>
            </aside>

            <main className="admin-main">
                <div className="admin-topbar">
                    <div>
                        <Badge bg="warning" text="dark">
                            Gestión de stock
                        </Badge>
                        <h1>Gestión de Inventario</h1>
                        <p>Entradas, salidas y trazabilidad de movimientos de stock.</p>
                    </div>

                    <div className="admin-user">
                        <span>
                            {usuario.nombre} {usuario.apellido}
                        </span>
                        <small>{usuario.rol}</small>
                    </div>
                </div>

                <Container fluid className="px-0">
                    {error && <Alert variant="danger">{error}</Alert>}
                    {mensaje && <Alert variant="success">{mensaje}</Alert>}

                    {cargando ? (
                        <div className="admin-loading">
                            <Spinner animation="border" />
                            <span>Cargando inventario...</span>
                        </div>
                    ) : (
                        <>
                            <Row>
                                <Col lg={12} className="mb-4">
                                    <Card className="admin-panel-card">
                                        <Card.Body>
                                            <h2>Productos con stock</h2>
                                            <p>
                                                Permite sumar o restar stock dejando historial del
                                                movimiento.
                                            </p>

                                            <div className="table-responsive">
                                                <Table hover className="align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>Código</th>
                                                            <th>Producto</th>
                                                            <th>Categoría</th>
                                                            <th>Precio</th>
                                                            <th>Stock</th>
                                                            <th>Semáforo</th>
                                                            <th>Umbrales</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {productos.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="8" className="text-center">
                                                                    No hay productos disponibles.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            productos.map((producto) => (
                                                                <tr key={producto.id_producto}>
                                                                    <td>{producto.codigo_interno}</td>
                                                                    <td>{producto.nombre_producto}</td>
                                                                    <td>{producto.nombre_categoria}</td>
                                                                    <td>
                                                                        $
                                                                        {Number(producto.precio).toLocaleString(
                                                                            "es-CL"
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        <Badge
                                                                            bg={obtenerBadgeStock(producto)}
                                                                            text={producto.estado_stock === "AMARILLO" ? "dark" : undefined}
                                                                        >
                                                                            {producto.stock}
                                                                        </Badge>
                                                                    </td>

                                                                    <td>
                                                                        <Badge
                                                                            bg={obtenerBadgeStock(producto)}
                                                                            text={producto.estado_stock === "AMARILLO" ? "dark" : undefined}
                                                                        >
                                                                            {obtenerTextoStock(producto)}
                                                                        </Badge>
                                                                    </td>

                                                                    <td>
                                                                        <small>
                                                                            Crítico: {producto.stock_critico ?? 5} / Alerta:{" "}
                                                                            {producto.stock_alerta ?? 10}
                                                                        </small>
                                                                    </td>
                                                                    <td>
                                                                        <Button
                                                                            size="sm"
                                                                            variant="success"
                                                                            className="me-2"
                                                                            onClick={() => abrirModal(producto, "ENTRADA")}
                                                                        >
                                                                            <FaArrowUp /> Sumar
                                                                        </Button>

                                                                        <Button
                                                                            size="sm"
                                                                            variant="danger"
                                                                            className="me-2"
                                                                            onClick={() => abrirModal(producto, "SALIDA")}
                                                                        >
                                                                            <FaArrowDown /> Restar
                                                                        </Button>

                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline-warning"
                                                                            onClick={() => abrirModalUmbrales(producto)}
                                                                        >
                                                                            Semáforo
                                                                        </Button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={12}>
                                    <Card className="admin-panel-card">
                                        <Card.Body>
                                            <h2>Historial de movimientos</h2>
                                            <p>
                                                Registro de entradas y salidas manuales de inventario.
                                            </p>

                                            <div className="table-responsive">
                                                <Table hover className="align-middle">
                                                    <thead>
                                                        <tr>
                                                            <th>Fecha</th>
                                                            <th>Producto</th>
                                                            <th>Tipo</th>
                                                            <th>Cantidad</th>
                                                            <th>Stock anterior</th>
                                                            <th>Stock nuevo</th>
                                                            <th>Motivo</th>
                                                            <th>Usuario</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {movimientos.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="8" className="text-center">
                                                                    No hay movimientos registrados.
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            movimientos.map((movimiento) => (
                                                                <tr key={movimiento.id_movimiento}>
                                                                    <td>{movimiento.fecha_movimiento}</td>
                                                                    <td>{movimiento.nombre_producto}</td>
                                                                    <td>
                                                                        <Badge
                                                                            bg={
                                                                                movimiento.tipo_movimiento === "ENTRADA"
                                                                                    ? "success"
                                                                                    : "danger"
                                                                            }
                                                                        >
                                                                            {movimiento.tipo_movimiento}
                                                                        </Badge>
                                                                    </td>
                                                                    <td>{movimiento.cantidad}</td>
                                                                    <td>{movimiento.stock_anterior}</td>
                                                                    <td>{movimiento.stock_nuevo}</td>
                                                                    <td>{movimiento.motivo}</td>
                                                                    <td>{movimiento.usuario || "Sistema"}</td>
                                                                </tr>
                                                            ))
                                                        )}
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                    )}
                </Container>
            </main>

            <Modal show={mostrarModal} onHide={cerrarModal} centered>
                <Form onSubmit={registrarMovimiento}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {tipoMovimiento === "ENTRADA" ? "Sumar stock" : "Restar stock"}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {errorModal && (
                            <Alert variant="danger">
                                {errorModal}
                            </Alert>
                        )}

                        {productoSeleccionado && (
                            <Alert variant="light">
                                <strong>{productoSeleccionado.nombre_producto}</strong>
                                <br />
                                Stock actual: {productoSeleccionado.stock}
                            </Alert>
                        )}

                        <Form.Group className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                                placeholder="Ingrese cantidad"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Motivo</Form.Label>
                            <Form.Select
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                            >
                                <option value="">Seleccione motivo</option>

                                {tipoMovimiento === "ENTRADA" ? (
                                    <>
                                        <option value="Reposición de inventario">
                                            Reposición de inventario
                                        </option>
                                        <option value="Compra a proveedor">
                                            Compra a proveedor
                                        </option>
                                        <option value="Devolución de cliente">
                                            Devolución de cliente
                                        </option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Merma">Merma</option>
                                        <option value="Producto dañado">Producto dañado</option>
                                        <option value="Corrección de inventario">
                                            Corrección de inventario
                                        </option>
                                    </>
                                )}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Observación</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={observacion}
                                onChange={(e) => setObservacion(e.target.value)}
                                placeholder="Detalle opcional del movimiento"
                            />
                        </Form.Group>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={cerrarModal}>
                            Cancelar
                        </Button>

                        <Button
                            variant={tipoMovimiento === "ENTRADA" ? "success" : "danger"}
                            type="submit"
                        >
                            Guardar movimiento
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
            <Modal show={mostrarModalUmbrales} onHide={cerrarModalUmbrales} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Editar semáforo de stock</Modal.Title>
                </Modal.Header>

                <Form onSubmit={guardarUmbralesStock}>
                    <Modal.Body>
                        {productoSeleccionado && (
                            <>
                                <p>
                                    <strong>Producto:</strong>{" "}
                                    {productoSeleccionado.nombre_producto}
                                </p>

                                <p>
                                    <strong>Stock actual:</strong> {productoSeleccionado.stock}
                                </p>

                                {errorModal && (
                                    <Alert variant="danger">{errorModal}</Alert>
                                )}

                                <Form.Group className="mb-3">
                                    <Form.Label>Stock crítico desde</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="0"
                                        value={stockCritico}
                                        onChange={(evento) => setStockCritico(evento.target.value)}
                                    />
                                    <Form.Text>
                                        Si el stock es menor o igual a este valor, el semáforo será rojo.
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Stock de alerta hasta</Form.Label>
                                    <Form.Control
                                        type="number"
                                        min="1"
                                        value={stockAlerta}
                                        onChange={(evento) => setStockAlerta(evento.target.value)}
                                    />
                                    <Form.Text>
                                        Si el stock está entre crítico + 1 y alerta, el semáforo será amarillo.
                                    </Form.Text>
                                </Form.Group>

                                <Alert variant="info">
                                    Con esta configuración: rojo hasta {stockCritico || 0}, amarillo
                                    hasta {stockAlerta || 0}, verde sobre {stockAlerta || 0}.
                                </Alert>
                            </>
                        )}
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={cerrarModalUmbrales}>
                            Cancelar
                        </Button>

                        <Button variant="warning" type="submit">
                            Guardar semáforo
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>

    );
}

export default AdminInventario;