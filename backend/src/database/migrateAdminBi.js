const db = require("../config/database");

const crearTablasBi = `
CREATE TABLE IF NOT EXISTS dim_categoria (
    id_categoria INTEGER PRIMARY KEY,
    nombre_categoria TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dim_producto (
    id_producto INTEGER PRIMARY KEY,
    codigo_interno TEXT,
    nombre_producto TEXT NOT NULL,
    precio_referencia INTEGER,
    estado TEXT
);

CREATE TABLE IF NOT EXISTS dim_tiempo (
    id_tiempo INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL UNIQUE,
    dia INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    nombre_mes TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS dim_cliente_tipo (
    id_cliente_tipo INTEGER PRIMARY KEY,
    tipo_cliente TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS hecho_venta (
    id_hecho INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    id_tiempo INTEGER NOT NULL,
    id_cliente_tipo INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario INTEGER NOT NULL,
    subtotal_linea INTEGER NOT NULL,
    iva_linea INTEGER NOT NULL,
    total_linea INTEGER NOT NULL
);
`;

const poblarBi = `
INSERT OR IGNORE INTO dim_cliente_tipo (id_cliente_tipo, tipo_cliente)
VALUES
(1, 'Registrado'),
(2, 'Invitado');

INSERT OR IGNORE INTO dim_categoria (id_categoria, nombre_categoria)
SELECT id_categoria, nombre_categoria
FROM categoria;

INSERT OR IGNORE INTO dim_producto (
    id_producto,
    codigo_interno,
    nombre_producto,
    precio_referencia,
    estado
)
SELECT
    id_producto,
    codigo_interno,
    nombre_producto,
    precio,
    estado
FROM producto;

INSERT OR IGNORE INTO dim_tiempo (
    fecha,
    dia,
    mes,
    anio,
    nombre_mes
)
SELECT DISTINCT
    DATE(v.fecha_venta) AS fecha,
    CAST(STRFTIME('%d', v.fecha_venta) AS INTEGER) AS dia,
    CAST(STRFTIME('%m', v.fecha_venta) AS INTEGER) AS mes,
    CAST(STRFTIME('%Y', v.fecha_venta) AS INTEGER) AS anio,
    CASE STRFTIME('%m', v.fecha_venta)
      WHEN '01' THEN 'Enero'
      WHEN '02' THEN 'Febrero'
      WHEN '03' THEN 'Marzo'
      WHEN '04' THEN 'Abril'
      WHEN '05' THEN 'Mayo'
      WHEN '06' THEN 'Junio'
      WHEN '07' THEN 'Julio'
      WHEN '08' THEN 'Agosto'
      WHEN '09' THEN 'Septiembre'
      WHEN '10' THEN 'Octubre'
      WHEN '11' THEN 'Noviembre'
      WHEN '12' THEN 'Diciembre'
    END AS nombre_mes
FROM venta v;

DELETE FROM hecho_venta;

INSERT INTO hecho_venta (
    id_venta,
    id_producto,
    id_categoria,
    id_tiempo,
    id_cliente_tipo,
    cantidad,
    precio_unitario,
    subtotal_linea,
    iva_linea,
    total_linea
)
SELECT
    v.id_venta,
    p.id_producto,
    p.id_categoria,
    t.id_tiempo,
    CASE
      WHEN v.id_usuario IS NOT NULL THEN 1
      ELSE 2
    END AS id_cliente_tipo,
    dv.cantidad,
    dv.precio_unitario,
    dv.subtotal_linea,
    ROUND(dv.subtotal_linea - (dv.subtotal_linea / 1.19), 0) AS iva_linea,
    dv.subtotal_linea AS total_linea
FROM detalle_venta dv
INNER JOIN venta v ON dv.id_venta = v.id_venta
INNER JOIN producto p ON dv.id_producto = p.id_producto
INNER JOIN dim_tiempo t ON t.fecha = DATE(v.fecha_venta);
`;

db.serialize(() => {
  db.exec(crearTablasBi, (errorCrear) => {
    if (errorCrear) {
      console.error("Error al crear tablas BI:", errorCrear.message);
      db.close();
      return;
    }

    db.exec(poblarBi, (errorPoblar) => {
      if (errorPoblar) {
        console.error("Error al poblar modelo estrella:", errorPoblar.message);
        db.close();
        return;
      }

      console.log("Modelo estrella Admin/BI creado y sincronizado correctamente");
      db.close();
    });
  });
});
