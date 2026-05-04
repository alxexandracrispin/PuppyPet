import { Container, Card } from "react-bootstrap";

function Nosotros() {
  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h1>Nosotros</h1>

          <p>
            PuppyPet es una aplicación académica desarrollada como punto de
            venta para una tienda de mascotas.
          </p>

          <p>
            Su objetivo principal es demostrar una arquitectura web moderna
            basada en frontend React, backend MVC, base de datos SQLite y
            generación de XML a partir de una venta.
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Nosotros;