// Reemplaza caracteres especiales que romperían la estructura XML.
// &, < y > tienen significado propio en XML y deben escaparse antes de insertarse en etiquetas
function limpiarTexto(valor) {
  if (!valor) return "";
  return String(valor)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Convierte la fecha de la venta al formato YYYY-MM-DD requerido por el estándar DTE del SII.
// toISOString() retorna un string como "2025-06-07T12:00:00.000Z"; el split toma solo la parte de la fecha
function obtenerFechaXml(fechaVenta) {
  const fecha = new Date(fechaVenta);
  return fecha.toISOString().split("T")[0];
}

// Construye el XML completo de la boleta electrónica según el formato DTE versión 1.0 del SII.
// Recorre cada producto de la venta para generar un bloque <Detalle> por línea
function generarXmlBoleta(data) {
  const { venta, detalles } = data;

  const fechaEmision = obtenerFechaXml(venta.fecha_venta);

  const detallesXml = detalles
    .map((detalle, index) => {
      return `
      <Detalle>
        <NroLinDet>${index + 1}</NroLinDet>
        <CdgItem>
          <TpoCodigo>INT1</TpoCodigo>
          <VlrCodigo>${limpiarTexto(detalle.codigo_interno)}</VlrCodigo>
        </CdgItem>
        <NmbItem>${limpiarTexto(detalle.nombre_producto)}</NmbItem>
        <QtyItem>${detalle.cantidad}</QtyItem>
        <PrcItem>${detalle.precio_unitario}</PrcItem>
        <MontoItem>${detalle.subtotal_linea}</MontoItem>
      </Detalle>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="ISO-8859-1"?>
<DTE version="1.0">
  <Documento ID="BOLETA_${venta.id_venta}">
    <Encabezado>
      <IdDoc>
        <TipoDTE>${venta.codigo_dte}</TipoDTE>
        <Folio>${venta.folio}</Folio>
        <FchEmis>${fechaEmision}</FchEmis>
      </IdDoc>

      <Emisor>
        <RUTEmisor>${limpiarTexto(venta.rut_emisor)}</RUTEmisor>
        <RznSoc>${limpiarTexto(venta.razon_social_emisor)}</RznSoc>
        <GiroEmis>${limpiarTexto(venta.giro_emisor)}</GiroEmis>
        <DirOrigen>${limpiarTexto(venta.direccion_origen)}</DirOrigen>
        <CmnaOrigen>${limpiarTexto(venta.comuna_origen)}</CmnaOrigen>
        <CiudadOrigen>${limpiarTexto(venta.ciudad_origen)}</CiudadOrigen>
      </Emisor>

      <Receptor>
        <RUTRecep>${limpiarTexto(venta.rut_cliente)}</RUTRecep>
        <RznSocRecep>${limpiarTexto(venta.razon_social_cliente)}</RznSocRecep>
      </Receptor>

      <Totales>
        <MntNeto>${venta.subtotal}</MntNeto>
        <IVA>${venta.iva}</IVA>
        <MntTotal>${venta.total}</MntTotal>
      </Totales>
    </Encabezado>
    ${detallesXml}
  </Documento>
</DTE>`;
}

module.exports = {
  generarXmlBoleta
};
