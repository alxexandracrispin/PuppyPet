function BoletaTicket({ venta, detalles }) {
  const formatearMonto = (valor) => {
    return Number(valor || 0).toLocaleString("es-CL");
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-CL");
  };

  if (!venta) {
    return null;
  }

  return (
    <div className="boleta-ticket">
      <div className="boleta-header">
        <h2>{venta.razon_social_emisor || "PuppyPet SPA"}</h2>
        <p>RUT: {venta.rut_emisor || "-"}</p>
        <p>{venta.giro_emisor || "Venta de productos para mascotas"}</p>
        <p>
          {venta.direccion_origen || "-"}, {venta.comuna_origen || "-"}
        </p>
        <p>{venta.ciudad_origen || "-"}</p>
      </div>

      <hr />

      <div className="boleta-info">
        <h3>BOLETA ELECTRÓNICA</h3>
        <p>Código DTE: {venta.codigo_dte || 39}</p>
        <p>Folio: {venta.folio || "-"}</p>
        <p>Fecha: {formatearFecha(venta.fecha_venta)}</p>
      </div>

      <hr />

      <div className="boleta-cliente">
        <p>
          <strong>RUT receptor:</strong> {venta.rut_cliente || "66.666.666-6"}
        </p>
        <p>
          <strong>Cliente:</strong>{" "}
          {venta.razon_social_cliente || "Consumidor Final"}
        </p>
        <p>
          <strong>Dirección:</strong> {venta.direccion_cliente || "-"}
        </p>
        <p>
          <strong>Comuna/Ciudad:</strong>{" "}
          {venta.comuna_cliente || "-"} / {venta.ciudad_cliente || "-"}
        </p>
      </div>

      <hr />

      <table className="boleta-tabla">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cant.</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          {detalles?.map((detalle) => (
            <tr key={detalle.id_detalle}>
              <td>{detalle.nombre_producto}</td>
              <td>{detalle.cantidad}</td>
              <td>${formatearMonto(detalle.subtotal_linea)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <div className="boleta-totales">
        <p>
          <span>Neto:</span>
          <strong>${formatearMonto(venta.subtotal)}</strong>
        </p>

        <p>
          <span>IVA:</span>
          <strong>${formatearMonto(venta.iva)}</strong>
        </p>

        <p className="boleta-total-final">
          <span>Total:</span>
          <strong>${formatearMonto(venta.total)}</strong>
        </p>
      </div>

      <hr />

      <div className="boleta-footer">
        <p>Gracias por su compra</p>
        <p>XML generado correctamente</p>
        <p className="boleta-nota">
          Documento visual simulado para fines académicos (Dev. Alexandra Crispin / Alejandro Gonzalez).
        </p>
      </div>
    </div>
  );
}

export default BoletaTicket;