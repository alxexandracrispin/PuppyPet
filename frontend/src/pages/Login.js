import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Modal
} from "react-bootstrap";
import { FaSignInAlt } from "react-icons/fa";
// useNavigate permite redirigir al usuario después del login exitoso
import { useNavigate } from "react-router-dom";

import api from "../api/api";

function Login() {
  const navigate = useNavigate();

  // Estado que centraliza los valores del formulario en un solo objeto
  const [formulario, setFormulario] = useState({
    correo: "",
    password: ""
  });

  const [cargando, setCargando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");

  const mostrarPopup = (mensaje) => {
    setModalMensaje(mensaje);
    setShowModal(true);
  };

  // manejarCambio actualiza solo el campo modificado usando el atributo name del input
  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const manejarLogin = async (event) => {
    event.preventDefault(); // Evita que el formulario recargue la página al enviarse

    if (!formulario.correo || !formulario.password) {
      mostrarPopup("Correo y contraseña son obligatorios.");
      return;
    }

    try {
      setCargando(true);

      const response = await api.post("/usuarios/login", formulario);

      const usuario = response.data.usuario;

      if (!usuario) {
        mostrarPopup("No se recibieron los datos del usuario.");
        return;
      }

      // Se guarda el usuario en localStorage para que persista entre páginas
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Se dispara un evento personalizado para que la Navbar actualice el menú inmediatamente
      window.dispatchEvent(new Event("usuarioActualizado"));

      navigate("/");

    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo iniciar sesión.";

      mostrarPopup(mensajeBackend);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="login-wrapper">
        <Row className="justify-content-center">
          <Col md={8} lg={5}>
            <Card className="login-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <FaSignInAlt className="registro-icon" />
                  <h1 className="registro-title">Iniciar Sesión</h1>
                  <p className="registro-subtitle">
                    Ingresa con tu correo y contraseña para comprar en PuppyPet.
                  </p>
                </div>

                <Form onSubmit={manejarLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Correo</Form.Label>
                    <Form.Control
                      type="email"
                      name="correo"
                      value={formulario.correo}
                      onChange={manejarCambio}
                      placeholder="correo@ejemplo.cl"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formulario.password}
                      onChange={manejarCambio}
                      placeholder="Ingrese su contraseña"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn-puppy w-100"
                    disabled={cargando}
                  >
                    {cargando ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-2"
                        />
                        Ingresando...
                      </>
                    ) : (
                      "Ingresar"
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-3">
                  <span>¿No tienes cuenta? </span>
                  <Button
                    variant="link"
                    className="p-0"
                    onClick={() => navigate("/registro")}
                  >
                    Regístrate aquí
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Inicio de sesión</Modal.Title>
        </Modal.Header>

        <Modal.Body>{modalMensaje}</Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Login;
