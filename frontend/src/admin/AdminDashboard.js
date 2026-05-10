import { useEffect, useMemo, useState } from "react";
import { Alert, Badge, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FaChartBar,
  FaChartLine,
  FaDollarSign,
  FaHome,
  FaPaw,
  FaReceipt,
  FaShoppingBasket,
  FaSignOutAlt,
  FaUsers
} from "react-icons/fa";
import api from "../api/api";
import "./AdminDashboard.css";

const formatoPesos = (valor) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0
  }).format(valor || 0);
};

const formatoNumero = (valor) => {
  return new Intl.NumberFormat("es-CL").format(valor || 0);
};

function BarraSimple({ label, value, maxValue, helper, money = false }) {
  const porcentaje = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;

  return (
    <div className="admin-chart-row">
      <div className="admin-chart-label">
        <span>{label}</span>
        <strong>{money ? formatoPesos(value) : formatoNumero(value)}</strong>
      </div>

      <div className="admin-chart-track">
        <div className="admin-chart-fill" style={{ width: `${porcentaje}%` }} />
      </div>

      {helper && <small>{helper}</small>}
    </div>
  );
}

function KpiCard({ titulo, valor, icono, variante }) {
  return (
    <Col md={6} xl={3} className="mb-3">
      <Card className={`admin-kpi-card admin-kpi-${variante}`}>
        <Card.Body>
          <div>
            <p>{titulo}</p>
            <h3>{valor}</h3>
          </div>
          <div className="admin-kpi-icon">{icono}</div>
        </Card.Body>
      </Card>
    </Col>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const [kpis, setKpis] = useState(null);
  const [productos, setProductos] = useState([]);
  const [ventasMes, setVentasMes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tiposCliente, setTiposCliente] = useState([]);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) {
      navigate("/login");
      return;
    }

    const usuarioParseado = JSON.parse(usuarioGuardado);

    if (usuarioParseado.rol !== "ADMIN") {
      navigate("/");
      return;
    }

    setUsuario(usuarioParseado);
  }, [navigate]);

  useEffect(() => {
    if (!usuario) return;

    const cargarDashboard = async () => {
      try {
        setCargando(true);
        setError("");

        const [
          responseKpis,
          responseProductos,
          responseVentasMes,
          responseCategorias,
          responseTiposCliente
        ] = await Promise.all([
          api.get("/admin/kpis"),
          api.get("/admin/productos-mas-vendidos"),
          api.get("/admin/ventas-por-mes"),
          api.get("/admin/ventas-por-categoria"),
          api.get("/admin/ventas-por-tipo-cliente")
        ]);

        setKpis(responseKpis.data);
        setProductos(responseProductos.data || []);
        setVentasMes(responseVentasMes.data || []);
        setCategorias(responseCategorias.data || []);
        setTiposCliente(responseTiposCliente.data || []);
      } catch (errorDashboard) {
        console.error("Error al cargar dashboard admin:", errorDashboard);
        setError("No se pudo cargar el dashboard administrativo.");
      } finally {
        setCargando(false);
      }
    };

    cargarDashboard();
  }, [usuario]);

  const maxProductos = useMemo(
    () => Math.max(...productos.map((item) => item.totalVendido || 0), 0),
    [productos]
  );

  const maxVentasMes = useMemo(
    () => Math.max(...ventasMes.map((item) => item.totalVendido || 0), 0),
    [ventasMes]
  );

  const maxCategorias = useMemo(
    () => Math.max(...categorias.map((item) => item.totalVendido || 0), 0),
    [categorias]
  );

  const maxTiposCliente = useMemo(
    () => Math.max(...tiposCliente.map((item) => item.totalVendido || 0), 0),
    [tiposCliente]
  );

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    window.dispatchEvent(new Event("usuarioActualizado"));
    navigate("/login");
  };

  if (!usuario) return null;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <FaPaw />
          <span>PuppyPet Admin</span>
        </div>

        <nav>
          <button className="active" type="button">
            <FaChartBar /> Dashboard BI
          </button>
          <button type="button" onClick={() => navigate("/")}> 
            <FaHome /> Volver a tienda
          </button>
          <button type="button" onClick={cerrarSesion}>
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <Badge bg="warning" text="dark">Modelo estrella simple</Badge>
            <h1>Dashboard Administrativo</h1>
            <p>Indicadores de ventas para apoyar decisiones básicas de negocio.</p>
          </div>
          <div className="admin-user">
            <span>{usuario.nombre} {usuario.apellido}</span>
            <small>{usuario.rol}</small>
          </div>
        </div>

        <Container fluid className="px-0">
          {error && <Alert variant="danger">{error}</Alert>}

          {cargando ? (
            <div className="admin-loading">
              <Spinner animation="border" />
              <span>Cargando indicadores...</span>
            </div>
          ) : (
            <>
              <Row>
                <KpiCard
                  titulo="Total vendido"
                  valor={formatoPesos(kpis?.totalVendido)}
                  icono={<FaDollarSign />}
                  variante="ventas"
                />
                <KpiCard
                  titulo="Cantidad de ventas"
                  valor={formatoNumero(kpis?.cantidadVentas)}
                  icono={<FaReceipt />}
                  variante="documentos"
                />
                <KpiCard
                  titulo="Productos vendidos"
                  valor={formatoNumero(kpis?.productosVendidos)}
                  icono={<FaShoppingBasket />}
                  variante="productos"
                />
                <KpiCard
                  titulo="Ticket promedio"
                  valor={formatoPesos(kpis?.ticketPromedio)}
                  icono={<FaChartLine />}
                  variante="ticket"
                />
              </Row>

              <Row>
                <Col lg={6} className="mb-4">
                  <Card className="admin-panel-card">
                    <Card.Body>
                      <h2>Productos más vendidos</h2>
                      <p>Ranking por unidades vendidas.</p>
                      {productos.length === 0 ? (
                        <Alert variant="light">Aún no existen ventas registradas.</Alert>
                      ) : (
                        productos.map((item) => (
                          <BarraSimple
                            key={item.producto}
                            label={item.producto}
                            value={item.totalVendido}
                            maxValue={maxProductos}
                            helper={`Ingresos: ${formatoPesos(item.totalIngresos)}`}
                          />
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6} className="mb-4">
                  <Card className="admin-panel-card">
                    <Card.Body>
                      <h2>Ventas por mes</h2>
                      <p>Evolución mensual del total vendido.</p>
                      {ventasMes.length === 0 ? (
                        <Alert variant="light">Aún no existen ventas registradas.</Alert>
                      ) : (
                        ventasMes.map((item) => (
                          <BarraSimple
                            key={`${item.periodo}`}
                            label={item.periodo}
                            value={item.totalVendido}
                            maxValue={maxVentasMes}
                            money
                            helper={`${formatoNumero(item.cantidadVentas)} venta(s)`}
                          />
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6} className="mb-4">
                  <Card className="admin-panel-card">
                    <Card.Body>
                      <h2>Ventas por categoría</h2>
                      <p>Ingreso acumulado por familia de productos.</p>
                      {categorias.length === 0 ? (
                        <Alert variant="light">Aún no existen ventas registradas.</Alert>
                      ) : (
                        categorias.map((item) => (
                          <BarraSimple
                            key={item.categoria}
                            label={item.categoria}
                            value={item.totalVendido}
                            maxValue={maxCategorias}
                            money
                            helper={`${formatoNumero(item.unidadesVendidas)} unidad(es)`}
                          />
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>

                <Col lg={6} className="mb-4">
                  <Card className="admin-panel-card">
                    <Card.Body>
                      <h2>Registrado vs invitado</h2>
                      <p>Comparación de ventas según tipo de cliente.</p>
                      {tiposCliente.length === 0 ? (
                        <Alert variant="light">Aún no existen ventas registradas.</Alert>
                      ) : (
                        tiposCliente.map((item) => (
                          <BarraSimple
                            key={item.tipoCliente}
                            label={item.tipoCliente}
                            value={item.totalVendido}
                            maxValue={maxTiposCliente}
                            money
                            helper={`${formatoNumero(item.cantidadVentas)} venta(s) / ${formatoNumero(item.unidadesVendidas)} unidad(es)`}
                          />
                        ))
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="admin-defense-card">
                <Card.Body>
                  <h2>Lectura académica del módulo</h2>
                  <p>
                    Este dashboard consume una tabla de hechos de ventas y dimensiones de producto,
                    categoría, tiempo y tipo de cliente. Su objetivo es aplicar inteligencia de negocio
                    simple para apoyar decisiones de stock, ventas y comportamiento de clientes sin convertir
                    el proyecto en una solución BI empresarial compleja. 
                    <p><b>Dev. Alexandra Crispin - Alejandro Gonzalez</b></p>
                  </p>
                </Card.Body>
              </Card>
            </>
          )}
        </Container>
      </main>
    </div>
  );
}

export default AdminDashboard;
