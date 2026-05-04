import { Card, Button, Badge } from "react-bootstrap";

function ProductoCard({ producto, onAgregar }) {
    return (
        <Card className="h-100 shadow-sm producto-card">
            <Card.Img
                variant="top"
                src={producto.imagen_url || "/assets/images/default-producto.png"}
                alt={producto.nombre_producto}
                className="producto-img"
            />

            <Card.Body className="d-flex flex-column">
                <div className="mb-2">
                    <Badge bg="secondary">
                        {producto.nombre_categoria}
                    </Badge>
                </div>

                <Card.Title>{producto.nombre_producto}</Card.Title>

                <Card.Text className="text-muted">
                    {producto.descripcion}
                </Card.Text>

                <p className="fw-bold fs-5 mt-auto">
                    ${producto.precio.toLocaleString("es-CL")}
                </p>

                <p className="small text-muted">
                    Stock disponible: {producto.stock}
                </p>

                <Button
                    className="btn-puppy w-100"
                    disabled={producto.stock <= 0}
                    onClick={() => onAgregar(producto)}
                >
                    {producto.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductoCard;