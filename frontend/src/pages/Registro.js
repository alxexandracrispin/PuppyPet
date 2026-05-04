import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

function Registro() {
  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: "700px" }}>
        <Card.Body>
          <h1 className="mb-4">Registro de usuario</h1>

          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control type="text" />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" />
            </Form.Group>

            <Button variant="success" className="w-100">
              Registrar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Registro;