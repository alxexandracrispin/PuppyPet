import { Container, Card, Form, Button } from "react-bootstrap";

function Contacto() {
  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: "700px" }}>
        <Card.Body>
          <h1 className="mb-4">Contacto</h1>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control type="text" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control as="textarea" rows={4} />
            </Form.Group>

            <Button variant="primary">
              Enviar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Contacto;