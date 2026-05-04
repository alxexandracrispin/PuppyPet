import { useLocation, useParams, Link } from "react-router-dom";
import { Container, Card, Button, Alert } from "react-bootstrap";

function VentaConfirmada() {
  const { idVenta } = useParams();
  const location = useLocation();

  const ventaData = location.state?.venta;

  const verXml = () => {
    window.open(`http://localhost:3001/api/ventas/${idVenta}/xml`, "_blank");
  };

  return (
    <Container className="py-5">
      <Card className="shadow-sm">
        <Card.Body>
          <h1 className="mb-3">Venta confirmada</h1>

          <Alert variant="success">
            La venta fue registrada correctamente y el XML fue generado.
          </Alert>

          <p>
            <strong>ID Venta:</strong> {idVenta}
          </p>

          {ventaData && (
            <>
              <p>
                <strong>Archivo XML:</strong> {ventaData.nombreArchivo}
              </p>

              <p>
                <strong>Total:</strong>{" "}
                ${ventaData.venta.total.toLocaleString("es-CL")}
              </p>
            </>
          )}

          <div className="d-flex gap-2">
            <Button variant="primary" onClick={verXml}>
              Ver XML generado
            </Button>

            <Button as={Link} to="/catalogo" variant="outline-secondary">
              Volver al catálogo
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default VentaConfirmada;