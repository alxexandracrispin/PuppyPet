import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Modal
} from "react-bootstrap";
import { FaUserPlus } from "react-icons/fa";

import api from "../api/api";

function Registro() {
  const [showModal, setShowModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");

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

  // Si el registro es exitoso se limpia el formulario para que el usuario pueda registrar otro
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

  // Las siguientes funciones replican la validación del backend para dar feedback
  // al usuario antes de enviar el formulario, evitando viajes innecesarios al servidor

  const limpiarRut = (rut) => {
    return rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
  };

  // Aplica el algoritmo módulo 11 para calcular el dígito verificador del RUT
  const calcularDv = (rutNumerico) => {
    let suma = 0;
    let multiplicador = 2;

    for (let i = rutNumerico.length - 1; i >= 0; i--) {
      suma += parseInt(rutNumerico.charAt(i), 10) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = suma % 11;
    const dvCalculado = 11 - resto;

    if (dvCalculado === 11) return "0";
    if (dvCalculado === 10) return "K";

    return dvCalculado.toString();
  };

  const validarRut = (rut) => {
    if (!rut) return false;

    const rutLimpio = limpiarRut(rut);

    if (rutLimpio.length < 2) return false;

    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);

    if (!/^\d+$/.test(cuerpo)) return false;
    if (!/^[0-9K]$/.test(dv)) return false;

    const rutNumero = parseInt(cuerpo, 10);

    if (rutNumero <= 1000000) return false;

    const dvCorrecto = calcularDv(cuerpo);

    return dv === dvCorrecto;
  };

  const validarPasswordSegura = (password) => {
    const tieneMinimo8   = password.length >= 8;
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneMinuscula = /[a-z]/.test(password);
    const tieneNumero    = /[0-9]/.test(password);
    const tieneSimbolo   = /[^A-Za-z0-9]/.test(password);

    return (
      tieneMinimo8 &&
      tieneMayuscula &&
      tieneMinuscula &&
      tieneNumero &&
      tieneSimbolo
    );
  };

  // requisitosPassword se recalcula en tiempo real mientras el usuario escribe
  // para mostrar los indicadores verdes/rojos de la política de contraseña
  const requisitosPassword = {
    minimo8:   formulario.password.length >= 8,
    mayuscula: /[A-Z]/.test(formulario.password),
    minuscula: /[a-z]/.test(formulario.password),
    numero:    /[0-9]/.test(formulario.password),
    simbolo:   /[^A-Za-z0-9]/.test(formulario.password)
  };

  const manejarRegistro = async (event) => {
    event.preventDefault();

    setMensajeExito("");
    setMensajeError("");

    if (
      !formulario.nombre ||
      !formulario.apellido ||
      !formulario.rut ||
      !formulario.correo ||
      !formulario.direccion ||
      !formulario.comuna ||
      !formulario.ciudad ||
      !formulario.password ||
      !formulario.confirmarPassword
    ) {
      mostrarPopup("Todos los campos son obligatorios");
      return;
    }

    if (!validarRut(formulario.rut)) {
      mostrarPopup(
        "El RUT ingresado no es válido. Debe ser mayor a 1.000.000 y respetar el dígito verificador."
      );
      return;
    }

    if (!validarPasswordSegura(formulario.password)) {
      mostrarPopup(
        "La contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo."
      );
      return;
    }

    try {
      setCargando(true);

      const response = await api.post("/usuarios/registro", formulario);

      mostrarPopup(
        response.data.mensaje || "Usuario registrado correctamente."
      );

      limpiarFormulario();
    } catch (error) {
      console.error("Error al registrar usuario:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo registrar el usuario.";

      mostrarPopup(mensajeBackend);
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

                    {formulario.password && (
                      <div className="mt-2 small">
                        <div className={requisitosPassword.minimo8 ? "text-success" : "text-danger"}>
                          {requisitosPassword.minimo8 ? "✓" : "✗"} Mínimo 8 caracteres
                        </div>

                        <div className={requisitosPassword.mayuscula ? "text-success" : "text-danger"}>
                          {requisitosPassword.mayuscula ? "✓" : "✗"} Al menos una letra mayúscula
                        </div>

                        <div className={requisitosPassword.minuscula ? "text-success" : "text-danger"}>
                          {requisitosPassword.minuscula ? "✓" : "✗"} Al menos una letra minúscula
                        </div>

                        <div className={requisitosPassword.numero ? "text-success" : "text-danger"}>
                          {requisitosPassword.numero ? "✓" : "✗"} Al menos un número
                        </div>

                        <div className={requisitosPassword.simbolo ? "text-success" : "text-danger"}>
                          {requisitosPassword.simbolo ? "✓" : "✗"} Al menos un símbolo
                        </div>
                      </div>
                    )}
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Validación de registro</Modal.Title>
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

export default Registro;
