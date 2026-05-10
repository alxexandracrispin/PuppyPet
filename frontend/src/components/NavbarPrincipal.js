import { Navbar, Nav, Container, NavDropdown, Badge } from "react-bootstrap";
import { FaPaw, FaShoppingCart, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function NavbarPrincipal() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const navigate = useNavigate();
  const location = useLocation();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const cargarUsuario = () => {
      const usuarioGuardado = localStorage.getItem("usuario");

      if (usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      } else {
        setUsuario(null);
      }
    };

    cargarUsuario();

    window.addEventListener("usuarioActualizado", cargarUsuario);
    window.addEventListener("storage", cargarUsuario);

    return () => {
      window.removeEventListener("usuarioActualizado", cargarUsuario);
      window.removeEventListener("storage", cargarUsuario);
    };
  }, [location.pathname]);

  const totalItems = carrito.reduce((total, item) => {
    return total + item.cantidad;
  }, 0);

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    setUsuario(null);
    window.dispatchEvent(new Event("usuarioActualizado"));
    navigate("/login");
  };

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

            {usuario ? (
              <>
                <Nav.Link as={Link} to="/perfil">
                  Hola, {usuario.nombre}
                </Nav.Link>

                <Nav.Link as={Link} to="/perfil">
                  MI PERFIL
                </Nav.Link>

                <Nav.Link as={Link} to="/mis-compras">
                  MIS COMPRAS
                </Nav.Link>

                <Nav.Link onClick={cerrarSesion}>
                  CERRAR SESIÓN
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/registro">
                  <FaUserPlus className="nav-icon" />
                  REGISTRO USUARIO
                </Nav.Link>

                <Nav.Link as={Link} to="/login">
                  <FaSignInAlt className="nav-icon" />
                  INICIAR SESIÓN
                </Nav.Link>
              </>
            )}

            <Nav.Link as={Link} to="/nosotros">
              NOSOTROS
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