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

  const mostrarPopup = (mensaje) => {
    setModalMensaje(mensaje);
    setShowModal(true);
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuarioParseado = JSON.parse(usuarioGuardado);

    setUsuario(usuarioParseado);

    setFormulario({
      nombre: usuarioParseado.nombre || "",
      apellido: usuarioParseado.apellido || "",
      correo: usuarioParseado.correo || "",
      rut: usuarioParseado.rut || "",
      direccion: usuarioParseado.direccion || "",
      comuna: usuarioParseado.comuna || "",
      ciudad: usuarioParseado.ciudad || ""
    });
  }, [navigate]);

  const manejarCambio = (event) => {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
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
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      correo: formulario.correo,
      direccion: formulario.direccion,
      comuna: formulario.comuna,
      ciudad: formulario.ciudad
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

      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
      window.dispatchEvent(new Event("storage"));

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

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
                <div>
                  <h5 className="mb-1">
                    <FaLock className="me-2" />
                    Seguridad
                  </h5>
                  <p className="mb-0 text-muted">
                    Próximo paso: permitir cambio de contraseña.
                  </p>
                </div>

                <Button
                  variant="outline-secondary"
                  onClick={() =>
                    mostrarPopup(
                      "El cambio de contraseña se implementará en el siguiente paso."
                    )
                  }
                >
                  Cambiar contraseña
                </Button>
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