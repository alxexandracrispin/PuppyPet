import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPaw, FaShoppingCart, FaUserPlus, FaSignInAlt } from "react-icons/fa";

function NavbarPrincipal() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const totalItems = carrito.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  return (
    <Navbar className="main-navbar" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-puppy">
          <FaPaw className="brand-icon" />
          <span>PuppyPet</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-puppypet" />

        <Navbar.Collapse id="navbar-puppypet">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={Link} to="/">
              HOME
            </Nav.Link>

            <NavDropdown title="CATÁLOGO" id="catalogo-dropdown">
              <NavDropdown.Item as={Link} to="/catalogo">
                Todos los productos
              </NavDropdown.Item>

              <NavDropdown.Divider />

              <NavDropdown.Item as={Link} to="/catalogo/Perros">
                Perros
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/catalogo/Gatos">
                Gatos
              </NavDropdown.Item>

              <NavDropdown.Item as={Link} to="/catalogo/Snack">
                Snack
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
              <FaUserPlus className="nav-icon" />
              REGISTRO USUARIO
            </Nav.Link>

            <Nav.Link as={Link} to="/login">
              <FaSignInAlt className="nav-icon" />
              INICIAR SESIÓN
            </Nav.Link>

            <Nav.Link as={Link} to="/nosotros">
              NOSOTROS
            </Nav.Link>

            <Nav.Link as={Link} to="/contacto">
              CONTACTO
            </Nav.Link>

            <Nav.Link as={Link} to="/carrito" className="cart-link">
              <FaShoppingCart className="nav-icon" />
              CARRITO{" "}
              {totalItems > 0 && (
                <Badge bg="warning" text="dark" pill>
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarPrincipal;