import { Container, Row, Col, Card } from "react-bootstrap";
import { FaPaw } from "react-icons/fa";
import { GiClover} from "react-icons/gi"

function Nosotros() {
  const tarjetas = [
    {
      titulo: "Alexandra Crispín Yáñez",
      texto: "Frontend Developer / QA",
      imagen: "/assets/images/alexandra.jpeg",
      icono: <GiClover />
    },
    {
      titulo: "Alejandro González Queupumil",
      texto: "Backend Developer / QA Lead",
      imagen: "/assets/images/alejandro.jpeg",
      icono: <span className="kanji-icon">亀</span>
    },

  ];

  return (
    <Container className="py-5">
      <div className="nosotros-wrapper">
        <div className="text-center mb-5">
          <FaPaw className="nosotros-main-icon" />
          <h1 className="section-title mb-3">Nosotros</h1>
          <p className="lead nosotros-lead">
            PuppyPet es una aplicación web orientada a simular un punto de venta
            para una tienda de mascotas, manteniendo una experiencia visual
            cercana al diseño original del proyecto.
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {tarjetas.map((tarjeta, index) => (
            <Col sm={10} md={6} lg={5} xl={4} key={index}>
              <Card className="nosotros-card h-100">
                <Card.Img
                  variant="top"
                  src={tarjeta.imagen}
                  alt={tarjeta.titulo}
                  className="nosotros-card-img"
                />

                <Card.Body className="text-center d-flex flex-column align-items-center">
                  <div className="nosotros-card-icon">{tarjeta.icono}</div>

                  <Card.Title className="nosotros-card-title">
                    {tarjeta.titulo}
                  </Card.Title>

                  <Card.Text className="nosotros-card-text">
                    {tarjeta.texto}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="nosotros-info mt-5">
          <h3>Objetivo del sistema</h3>
          <p>
            El objetivo principal del proyecto es transformar una maqueta HTML
            estática en una aplicación web funcional, incorporando catálogo
            dinámico, carrito de compras, registro de venta y generación de XML
            asociado a una boleta.
          </p>
        </div>
      </div>
    </Container>
  );
}

export default Nosotros;