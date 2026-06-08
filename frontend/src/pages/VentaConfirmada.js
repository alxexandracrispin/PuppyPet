import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";

import BoletaTicket from "../components/BoletaTicket";
import api from "../api/api";

function VentaConfirmada() {
  const { idVenta } = useParams();
  const location = useLocation();

  // location.state permite recibir los datos de la venta directamente desde Carrito.js
  // sin necesidad de hacer una nueva consulta a la API
  const ventaDesdeState = location.state?.venta;

  const [ventaData, setVentaData] = useState(ventaDesdeState || null);

  // Solo se muestra el spinner si no llegaron datos por state (ej: acceso directo por URL)
  const [cargando, setCargando] = useState(!ventaDesdeState);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarVenta = async () => {
      if (ventaDesdeState) {
        return; // Ya tenemos los datos, no se consulta la API
      }

      try {
        setCargando(true);
        setError("");

        const response = await api.get(`/ventas/${idVenta}`);

        setVentaData(response.data);
      } catch (error) {
        console.error("Error al cargar venta confirmada:", error);

        const mensajeBackend =
          error.response?.data?.mensaje ||
          error.response?.data?.error ||
          "No se pudo cargar la información de la venta.";

        setError(mensajeBackend);
      } finally {
        setCargando(false);
      }
    };

    cargarVenta();
  }, [idVenta, ventaDesdeState]);

  const verXml = () => {
    // Abre el XML en una nueva pestaña del navegador
    window.open(`http://localhost:3001/api/ventas/${idVenta}/xml`, "_blank");
  };

  const imprimirBoleta = () => {
    window.print();
  };

  if (cargando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p className="mt-3">Cargando venta...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>

        <Button as={Link} to="/catalogo" variant="outline-secondary">
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  if (!ventaData) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          No se encontró información para esta venta.
        </Alert>

        <Button as={Link} to="/catalogo" variant="outline-secondary">
          Volver al catálogo
        </Button>
      </Container>
    );
  }

  const venta = ventaData.venta;
  const detalles = ventaData.detalles || [];

  return (
    <Container className="py-5">
      <Card className="shadow-sm no-print">
        <Card.Body>
          <h1 className="mb-3">Venta confirmada</h1>

          <Alert variant="success">
            La venta fue registrada correctamente y el XML fue generado.
          </Alert>

          <p>
            <strong>ID Venta:</strong> {idVenta}
          </p>

          {ventaData.nombreArchivo && (
            <p>
              <strong>Archivo XML:</strong> {ventaData.nombreArchivo}
            </p>
          )}

          <p>
            <strong>Folio:</strong> {venta.folio}
          </p>

          <p>
            <strong>Total:</strong> ${venta.total.toLocaleString("es-CL")}
          </p>

          <div className="d-flex gap-2 flex-wrap">
            <Button variant="primary" onClick={verXml}>
              Ver XML generado
            </Button>

            <Button variant="success" onClick={imprimirBoleta}>
              Imprimir boleta
            </Button>

            <Button as={Link} to="/catalogo" variant="outline-secondary">
              Volver al catálogo
            </Button>
          </div>
        </Card.Body>
      </Card>

      <div className="my-4">
        <BoletaTicket venta={venta} detalles={detalles} />
      </div>
    </Container>
  );
}

export default VentaConfirmada;
