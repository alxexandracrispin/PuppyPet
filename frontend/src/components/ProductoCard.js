import { Card, Button, Badge } from "react-bootstrap";
import { FaCartPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProductoCard({ producto, onAgregar }) {

  const navigate = useNavigate();

  return (
    // El onClick de la Card navega al detalle del producto al hacer clic en cualquier parte
    <Card
      className="h-100 shadow-sm producto-card producto-card-dark"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/producto/${producto.id_producto}`)}
    >
      {/* imagen_url con fallback a imagen por defecto si el producto no tiene foto */}
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
          onClick={(event) => {
            event.stopPropagation(); // Evita que el clic en el botón también active el onClick de la Card
            onAgregar(producto);
          }}
        >
          <FaCartPlus className="me-2" />
          {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductoCard;
