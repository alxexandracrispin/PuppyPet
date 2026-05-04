import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function NavbarPrincipal() {
  return (
    <Navbar className="main-navbar" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          PuppyPet
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-puppypet" />

        <Navbar.Collapse id="navbar-puppypet">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              HOME
            </Nav.Link>

            <NavDropdown title="CATÁLOGO" id="catalogo-dropdown">
              <NavDropdown.Item as={Link} to="/catalogo/Perros">
                Catálogo de Perros
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/catalogo/Gatos">
                Catálogo de Gatos
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/catalogo/Snack">
                Catálogo de Snack
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/catalogo/Accesorios">
                Accesorios
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/catalogo/Higiene">
                Higiene
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/catalogo/Juguetes">
                Juguetes
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} to="/registro">
              REGISTRO USUARIO
            </Nav.Link>

            <Nav.Link as={Link} to="/login">
              INICIAR SESIÓN
            </Nav.Link>

            <Nav.Link as={Link} to="/nosotros">
              NOSOTROS
            </Nav.Link>

            <Nav.Link as={Link} to="/contacto">
              CONTACTO
            </Nav.Link>

            <Nav.Link as={Link} to="/carrito">
              CARRITO
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarPrincipal;