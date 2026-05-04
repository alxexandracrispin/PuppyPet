import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPaw, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaCreditCard } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer-puppy py-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-title">
              <FaPaw className="footer-icon" /> PuppyPet
            </h5>
            <p className="mb-2">
              Tu tienda especializada en productos de excelente calidad y los
              mejores precios para el cuidado de tus mascotas.
            </p>
            <small>
              Proyecto académico de punto de venta con generación de boleta XML.
            </small>
          </Col>

          <Col md={4} className="mb-4 mb-md-0">
            <h6 className="footer-subtitle">Navegación</h6>
            <ul className="list-unstyled footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li>
                <Link to="/registro">Registro usuario</Link>
              </li>
              <li>
                <Link to="/carrito">Carrito</Link>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h6 className="footer-subtitle">Contacto</h6>
            <ul className="list-unstyled mb-3">
              <li><FaMapMarkerAlt className="footer-list-icon" /> Av. Siempre Viva 742, Santiago</li>
              <li><FaPhoneAlt className="footer-list-icon" /> +56 2 2345 6789</li>
              <li><FaEnvelope className="footer-list-icon" /> info@puppypet.cl</li>
            </ul>

            <h6 className="footer-subtitle">Medios de pago</h6>
            <p className="mb-0 payment-methods">
              <FaCreditCard className="footer-list-icon" />
              Mastercard · Visa · Paypal
            </p>
          </Col>
        </Row>

        <hr className="footer-line" />

        <div className="text-center">
          <small>
            © 2026 PuppyPet. Todos los derechos reservados. Diseñado por Ale².
          </small>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;