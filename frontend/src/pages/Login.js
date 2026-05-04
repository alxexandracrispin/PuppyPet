import { Container, Card, Form, Button } from "react-bootstrap";

function Login() {
  return (
    <Container className="py-5">
      <Card className="mx-auto shadow-sm" style={{ maxWidth: "450px" }}>
        <Card.Body>
          <h1 className="mb-4">Iniciar sesión</h1>

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" placeholder="correo@ejemplo.cl" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="********" />
            </Form.Group>

            <Button variant="primary" className="w-100">
              Ingresar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;