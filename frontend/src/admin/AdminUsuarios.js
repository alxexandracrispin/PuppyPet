import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
  Table
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaHome,
  FaPaw,
  FaShoppingBasket,
  FaSignOutAlt,
  FaUsers
} from "react-icons/fa";

import api from "../api/api";
import "./AdminDashboard.css";

function AdminUsuarios() {
  const navigate = useNavigate();

  const [usuario, setUsuario]     = useState(null);
  const [usuarios, setUsuarios]   = useState([]);
  const [cargando, setCargando]   = useState(true);
  const [error, setError]         = useState("");
  const [mensaje, setMensaje]     = useState("");

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuarioParseado = JSON.parse(usuarioGuardado);

    // Si el usuario no tiene rol ADMIN, se redirige al inicio para proteger el panel
    if (usuarioParseado.rol !== "ADMIN") {
      navigate("/");
      return;
    }

    setUsuario(usuarioParseado);
  }, [navigate]);

  // Se cargan todos los usuarios al montar la vista, usando el endpoint GET /api/usuarios
  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError("");

      const response = await api.get("/usuarios");
      setUsuarios(response.data || []);
    } catch (errorCarga) {
      console.error("Error al cargar usuarios:", errorCarga);
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (usuario) {
      cargarUsuarios();
    }
  }, [usuario]);

  // cambiarRol llama al endpoint PUT /api/usuarios/:id/rol y actualiza el estado local
  // sin necesidad de recargar toda la lista desde la API
  const cambiarRol = async (idUsuario, nuevoRol) => {
    try {
      setMensaje("");
      setError("");

      await api.put(`/usuarios/${idUsuario}/rol`, { rol: nuevoRol });

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === idUsuario ? { ...u, rol: nuevoRol } : u
        )
      );

      setMensaje(`Rol actualizado correctamente para el usuario #${idUsuario}.`);
    } catch (errorRol) {
      console.error("Error al cambiar rol:", errorRol);
      setError(
        errorRol.response?.data?.mensaje || "No se pudo actualizar el rol."
      );
    }
  };

  // cambiarEstado llama al endpoint PUT /api/usuarios/:id/estado
  // y alterna entre ACTIVO e INACTIVO según el estado actual del usuario
  const cambiarEstado = async (idUsuario, estadoActual) => {
    const nuevoEstado = estadoActual === "ACTIVO" ? "INACTIVO" : "ACTIVO";

    try {
      setMensaje("");
      setError("");

      await api.put(`/usuarios/${idUsuario}/estado`, { estado: nuevoEstado });

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === idUsuario ? { ...u, estado: nuevoEstado } : u
        )
      );

      setMensaje(`Estado actualizado a ${nuevoEstado} para el usuario #${idUsuario}.`);
    } catch (errorEstado) {
      console.error("Error al cambiar estado:", errorEstado);
      setError(
        errorEstado.response?.data?.mensaje || "No se pudo actualizar el estado."
      );
    }
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

          <button type="button" onClick={() => navigate("/admin/inventario")}>
            <FaShoppingBasket /> Inventario
          </button>

          <button className="active" type="button">
            <FaUsers /> Usuarios
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
            <Badge bg="warning" text="dark">Gestión de usuarios</Badge>
            <h1>Usuarios registrados</h1>
            <p>Administra roles y estados de acceso de los usuarios del sistema.</p>
          </div>

          <div className="admin-user">
            <span>{usuario.nombre} {usuario.apellido}</span>
            <small>{usuario.rol}</small>
          </div>
        </div>

        <Container fluid className="px-0">
          {error   && <Alert variant="danger"  onClose={() => setError("")}   dismissible>{error}</Alert>}
          {mensaje && <Alert variant="success" onClose={() => setMensaje("")} dismissible>{mensaje}</Alert>}

          {cargando ? (
            <div className="admin-loading">
              <Spinner animation="border" />
              <span>Cargando usuarios...</span>
            </div>
          ) : (
            <Row>
              <Col lg={12}>
                <Card className="admin-panel-card">
                  <Card.Body>
                    <h2>Lista de usuarios</h2>
                    <p>Total: {usuarios.length} usuario(s) registrado(s).</p>

                    <div className="table-responsive">
                      <Table hover className="align-middle">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>RUT</th>
                            <th>Correo</th>
                            <th>Comuna</th>
                            <th className="text-center">Rol</th>
                            <th className="text-center">Estado</th>
                          </tr>
                        </thead>

                        <tbody>
                          {usuarios.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="text-center">
                                No hay usuarios registrados.
                              </td>
                            </tr>
                          ) : (
                            usuarios.map((u) => (
                              <tr key={u.id_usuario}>
                                <td>{u.id_usuario}</td>

                                <td>
                                  {u.nombre} {u.apellido}
                                </td>

                                <td>{u.rut}</td>
                                <td>{u.correo}</td>
                                <td>{u.comuna}</td>

                                <td className="text-center">
                                  {/* El selector permite cambiar el rol directamente desde la tabla */}
                                  <Form.Select
                                    size="sm"
                                    value={u.rol}
                                    onChange={(e) =>
                                      cambiarRol(u.id_usuario, e.target.value)
                                    }
                                    style={{ width: "110px", margin: "0 auto" }}
                                  >
                                    <option value="CLIENTE">CLIENTE</option>
                                    <option value="ADMIN">ADMIN</option>
                                  </Form.Select>
                                </td>

                                <td className="text-center">
                                  {/* El botón alterna entre ACTIVO e INACTIVO con un solo clic */}
                                  <Button
                                    size="sm"
                                    variant={
                                      u.estado === "ACTIVO"
                                        ? "outline-success"
                                        : "outline-danger"
                                    }
                                    onClick={() =>
                                      cambiarEstado(u.id_usuario, u.estado)
                                    }
                                  >
                                    <Badge
                                      bg={u.estado === "ACTIVO" ? "success" : "danger"}
                                    >
                                      {u.estado}
                                    </Badge>
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
          )}
        </Container>
      </main>
    </div>
  );
}

export default AdminUsuarios;
