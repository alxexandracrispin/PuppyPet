import { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Spinner,
  Modal,
  Alert
} from "react-bootstrap";
import { FaUserEdit, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import api from "../api/api";

// La página tiene dos formularios independientes: uno para datos personales y otro para contraseña
function MiPerfil() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(null);
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rut: "",
    direccion: "",
    comuna: "",
    ciudad: ""
  });

  const [cargando, setCargando] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [cargandoPassword, setCargandoPassword] = useState(false);

  const [formularioPassword, setFormularioPassword] = useState({
    passwordActual: "",
    nuevaPassword: "",
    confirmarNuevaPassword: ""
  });

  const mostrarPopup = (mensaje) => {
    setModalMensaje(mensaje);
    setShowModal(true);
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    // Si no hay sesión activa, se redirige al login en lugar de mostrar el perfil vacío
    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuarioParseado = JSON.parse(usuarioGuardado);

    setUsuario(usuarioParseado);

    setFormulario({
      nombre:    usuarioParseado.nombre    || "",
      apellido:  usuarioParseado.apellido  || "",
      correo:    usuarioParseado.correo    || "",
      rut:       usuarioParseado.rut       || "",
      direccion: usuarioParseado.direccion || "",
      comuna:    usuarioParseado.comuna    || "",
      ciudad:    usuarioParseado.ciudad    || ""
    });
  }, [navigate]);

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  };

  const manejarCambioPassword = (event) => {
    const { name, value } = event.target;

    setFormularioPassword({
      ...formularioPassword,
      [name]: value
    });
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

  // requisitosPassword se recalcula en tiempo real para mostrar los indicadores de la política
  const requisitosPassword = {
    minimo8:   formularioPassword.nuevaPassword.length >= 8,
    mayuscula: /[A-Z]/.test(formularioPassword.nuevaPassword),
    minuscula: /[a-z]/.test(formularioPassword.nuevaPassword),
    numero:    /[0-9]/.test(formularioPassword.nuevaPassword),
    simbolo:   /[^A-Za-z0-9]/.test(formularioPassword.nuevaPassword)
  };

  const validarCampos = () => {
    if (
      !formulario.nombre ||
      !formulario.apellido ||
      !formulario.correo ||
      !formulario.direccion ||
      !formulario.comuna ||
      !formulario.ciudad
    ) {
      mostrarPopup("Todos los campos editables son obligatorios.");
      return false;
    }

    return true;
  };

  const guardarCambios = async (event) => {
    event.preventDefault();

    if (!validarCampos()) {
      return;
    }

    if (!usuario?.idUsuario) {
      mostrarPopup("No se encontró el usuario en sesión.");
      return;
    }

    const datosActualizados = {
      nombre:    formulario.nombre,
      apellido:  formulario.apellido,
      correo:    formulario.correo,
      direccion: formulario.direccion,
      comuna:    formulario.comuna,
      ciudad:    formulario.ciudad
    };

    try {
      setCargando(true);

      const response = await api.put(
        `/usuarios/${usuario.idUsuario}`,
        datosActualizados
      );

      const usuarioActualizado = {
        ...usuario,
        ...datosActualizados
      };

      // Se sincroniza el localStorage con los nuevos datos
      // y se dispara el evento para que la Navbar actualice el nombre del usuario
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      window.dispatchEvent(new Event("usuarioActualizado"));

      setUsuario(usuarioActualizado);

      mostrarPopup(
        response.data.mensaje || "Datos actualizados correctamente."
      );
    } catch (error) {
      console.error("Error al actualizar perfil:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudieron actualizar los datos del usuario.";

      mostrarPopup(mensajeBackend);
    } finally {
      setCargando(false);
    }
  };

  const cambiarPassword = async (event) => {
    event.preventDefault();

    if (!usuario?.idUsuario) {
      mostrarPopup("No se encontró el usuario en sesión.");
      return;
    }

    if (
      !formularioPassword.passwordActual ||
      !formularioPassword.nuevaPassword ||
      !formularioPassword.confirmarNuevaPassword
    ) {
      mostrarPopup("Todos los campos de contraseña son obligatorios.");
      return;
    }

    if (!validarPasswordSegura(formularioPassword.nuevaPassword)) {
      mostrarPopup(
        "La nueva contraseña debe tener mínimo 8 caracteres, incluir mayúscula, minúscula, número y símbolo."
      );
      return;
    }

    if (
      formularioPassword.nuevaPassword !==
      formularioPassword.confirmarNuevaPassword
    ) {
      mostrarPopup("La nueva contraseña y su confirmación no coinciden.");
      return;
    }

    try {
      setCargandoPassword(true);

      const response = await api.put(
        `/usuarios/${usuario.idUsuario}/password`,
        formularioPassword
      );

      setFormularioPassword({
        passwordActual: "",
        nuevaPassword: "",
        confirmarNuevaPassword: ""
      });

      mostrarPopup(
        response.data.mensaje || "Contraseña actualizada correctamente."
      );
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);

      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||
        "No se pudo actualizar la contraseña.";

      mostrarPopup(mensajeBackend);
    } finally {
      setCargandoPassword(false);
    }
  };

  if (!usuario) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando perfil...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="registro-card">
            <Card.Body>
              <div className="text-center mb-4">
                <FaUserEdit className="registro-icon" />
                <h1 className="registro-title">Mi Perfil</h1>
                <p className="registro-subtitle">
                  Actualiza tus datos personales para futuras compras y emisión
                  de boletas.
                </p>
              </div>

              <Alert variant="info">
                El RUT no puede ser modificado, ya que se utiliza como dato
                tributario del cliente.
              </Alert>

              <Form onSubmit={guardarCambios}>
                <Row>
                  <Col md={6}>
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
                  </Col>

                  <Col md={6}>
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
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>RUT</Form.Label>
                  <Form.Control
                    type="text"
                    name="rut"
                    value={formulario.rut}
                    disabled
                    readOnly
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

                <Row>
                  <Col md={6}>
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
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label>Ciudad</Form.Label>
                      <Form.Control
                        type="text"
                        name="ciudad"
                        value={formulario.ciudad}
                        onChange={manejarCambio}
                        placeholder="Ingrese su ciudad"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button
                  type="submit"
                  className="btn-puppy w-100"
                  disabled={cargando}
                >
                  {cargando ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar cambios"
                  )}
                </Button>
              </Form>

              <hr className="my-4" />

              <div>
                <h5 className="mb-3">
                  <FaLock className="me-2" />
                  Seguridad
                </h5>

                <p className="text-muted">
                  Cambia tu contraseña ingresando primero la contraseña actual.
                </p>

                <Form onSubmit={cambiarPassword}>
                  <Form.Group className="mb-3">
                    <Form.Label>Contraseña actual</Form.Label>
                    <Form.Control
                      type="password"
                      name="passwordActual"
                      value={formularioPassword.passwordActual}
                      onChange={manejarCambioPassword}
                      placeholder="Ingrese su contraseña actual"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Nueva contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="nuevaPassword"
                      value={formularioPassword.nuevaPassword}
                      onChange={manejarCambioPassword}
                      placeholder="Ingrese una nueva contraseña"
                    />

                    {formularioPassword.nuevaPassword && (
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
                    <Form.Label>Confirmar nueva contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmarNuevaPassword"
                      value={formularioPassword.confirmarNuevaPassword}
                      onChange={manejarCambioPassword}
                      placeholder="Repita la nueva contraseña"
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="outline-secondary"
                    className="w-100"
                    disabled={cargandoPassword}
                  >
                    {cargandoPassword ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Actualizando contraseña...
                      </>
                    ) : (
                      "Cambiar contraseña"
                    )}
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mi Perfil</Modal.Title>
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

export default MiPerfil;
