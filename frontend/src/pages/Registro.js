import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner
} from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";

import api from "../api/api";

function Registro() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    direccion: "",
    comuna: "",
    ciudad: "",
    password: "",
    confirmarPassword: ""
  });

  const [cargando, setCargando] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [mensajeError, setMensajeError] = useState("");

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const limpiarFormulario = () => {
    setFormulario({
      nombre: "",
      apellido: "",
      rut: "",
      correo: "",
      direccion: "",
      comuna: "",
      ciudad: "",
      password: "",
      confirmarPassword: ""
    });
  };

  const manejarRegistro = async (event) => {
    event.preventDefault();

    setMensajeExito("");
    setMensajeError("");

    if (formulario.password !== formulario.confirmarPassword) {
      setMensajeError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setCargando(true);

      const response = await api.post("/usuarios/registro", formulario);

      setMensajeExito(
        response.data.mensaje || "Usuario registrado correctamente."
      );

      limpiarFormulario();
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo registrar el usuario.";

      setMensajeError(mensajeBackend);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Container className="py-5">
      <div className="registro-wrapper">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="registro-card">
              <Card.Body>
                <div className="text-center mb-4">
                  <FaUserPlus className="registro-icon" />
                  <h1 className="registro-title">Registro de Usuario</h1>
                  <p className="registro-subtitle">
                    Crea una cuenta para comprar productos en PuppyPet.
                  </p>
                </div>

                {mensajeExito && (
                  <Alert variant="success">{mensajeExito}</Alert>
                )}

                {mensajeError && (
                  <Alert variant="danger">{mensajeError}</Alert>
                )}

                <Form onSubmit={manejarRegistro}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                      placeholder="Ingrese su nombre"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      name="apellido"
                      value={formulario.apellido}
                      onChange={manejarCambio}
                      placeholder="Ingrese su apellido"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>RUT</Form.Label>
                    <Form.Control
                      type="text"
                      name="rut"
                      value={formulario.rut}
                      onChange={manejarCambio}
                      placeholder="Ej: 12345678-9"
                    />
                  </Form.Group>

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

                  <Form.Group className="mb-3">
                    <Form.Label>Dirección</Form.Label>
                    <Form.Control
                      type="text"
                      name="direccion"
                      value={formulario.direccion}
                      onChange={manejarCambio}
                      placeholder="Ingrese su dirección"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Comuna</Form.Label>
                    <Form.Control
                      type="text"
                      name="comuna"
                      value={formulario.comuna}
                      onChange={manejarCambio}
                      placeholder="Ingrese su comuna"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ciudad</Form.Label>
                    <Form.Control
                      type="text"
                      name="ciudad"
                      value={formulario.ciudad}
                      onChange={manejarCambio}
                      placeholder="Ingrese su ciudad"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formulario.password}
                      onChange={manejarCambio}
                      placeholder="Ingrese una contraseña"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Confirmar contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmarPassword"
                      value={formulario.confirmarPassword}
                      onChange={manejarCambio}
                      placeholder="Repita la contraseña"
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
                        Registrando...
                      </>
                    ) : (
                      "Registrarse"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

export default Registro;