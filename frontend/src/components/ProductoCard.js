import { Card, Button, Badge } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";

function ProductoCard({ producto, onAgregar }) {
  return (
    <Card className="h-100 shadow-sm producto-card producto-card-dark">
      <Card.Img
        variant="top"
        src={producto.imagen_url || "/assets/images/default-producto.png"}
        alt={producto.nombre_producto}
        className="producto-img"
      />

      <Card.Body className="d-flex flex-column text-center">
        <div className="mb-2">
          <Badge bg="warning" text="dark">
            {producto.nombre_categoria}
          </Badge>
        </div>

        <Card.Title className="producto-title">
          {producto.nombre_producto}
        </Card.Title>

        <Card.Text className="producto-description">
          {producto.descripcion}
        </Card.Text>

        <p className="producto-price mt-auto">
          ${producto.precio.toLocaleString("es-CL")}
        </p>

        <p className="small producto-stock">
          Stock disponible: {producto.stock}
        </p>

        <Button
          variant="warning"
          className="w-100 fw-bold"
          disabled={producto.stock <= 0}
          onClick={() => onAgregar(producto)}
        >
          <FaCartPlus className="me-2" />
          {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductoCard;