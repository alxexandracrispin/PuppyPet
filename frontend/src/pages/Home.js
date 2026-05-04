import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  const categorias = [
    {
      nombre: "Productos para perros",
      ruta: "/catalogo/Perros",
      texto: "Alimentos y accesorios para perros.",
      imagen: "/assets/images/perro.jpg"
    },
    {
      nombre: "Productos para gatos",
      ruta: "/catalogo/Gatos",
      texto: "Alimentos y productos para gatos.",
      imagen: "/assets/images/gato.png"
    },
    {
      nombre: "Snack",
      ruta: "/catalogo/Snack",
      texto: "Premios y snacks para mascotas.",
      imagen: "/assets/images/snackdental.webp"
    },
    {
      nombre: "Accesorios",
      ruta: "/catalogo/Accesorios",
      texto: "Accesorios útiles para el cuidado diario.",
      imagen: "/assets/images/arnes.jpg"
    },
    {
      nombre: "Higiene",
      ruta: "/catalogo/Higiene",
      texto: "Productos de limpieza e higiene.",
      imagen: "/assets/images/higiene.webp"
    },
    {
      nombre: "Juguetes",
      ruta: "/catalogo/Juguetes",
      texto: "Juguetes para entretención y estimulación.",
      imagen: "/assets/images/juguetes.jpg"
    }
  ];

  return (
    <>
      <section
        className="hero-section"
        style={{
          backgroundImage:
            'linear-gradient(rgba(75, 46, 36, 0.55), rgba(75, 46, 36, 0.55)), url("/assets/images/fondo.jpeg")'
        }}
      >
        <Container className="text-center">
          <h1 className="hero-title">BIENVENIDO A PUPPYPET</h1>

          <p className="hero-subtitle mx-auto mt-3">
            Todo lo que necesitas para el cuidado de tus mascotas en un solo lugar
          </p>

          <Button
            as={Link}
            to="/registro"
            size="lg"
            className="btn-puppy mt-3"
          >
            REGISTRARSE
          </Button>
        </Container>
      </section>

      <Container className="py-5">
        <h2 className="section-title">PRODUCTOS DESTACADOS</h2>

        <Row>
          {categorias.map((categoria) => (
            <Col md={4} className="mb-4" key={categoria.nombre}>
              <Card className="category-card h-100 shadow-sm">
                <Card.Img
                  variant="top"
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  className="category-card-img"
                />

                <Card.Body className="text-center p-4">
                  <Card.Title className="fw-bold">
                    {categoria.nombre}
                  </Card.Title>

                  <Card.Text>{categoria.texto}</Card.Text>

                  <Button
                    as={Link}
                    to={categoria.ruta}
                    className="btn-puppy"
                  >
                    Ver categoría
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Home;
