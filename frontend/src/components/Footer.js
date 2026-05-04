import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer className="footer-puppy py-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>PuppyPet</h5>
            <p className="mb-0">
              Tu tienda especializada en productos de excelente calidad y los
              mejores precios del mercado.
            </p>
          </Col>

          <Col md={6} className="mt-4 mt-md-0">
            <h6>Contacto</h6>
            <ul className="list-unstyled mb-0">
              <li>Av. Siempre Viva 742, Santiago</li>
              <li>+56 2 2345 6789</li>
              <li>info@PuppyPet.cl</li>
            </ul>
          </Col>
        </Row>

        <hr className="border-light" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <small>
            © 2026 PuppyPet. Todos los derechos reservados. - Diseñado por Ale^2
          </small>

          <small className="mt-2 mt-md-0">
            Mastercard · Visa · Paypal
          </small>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;