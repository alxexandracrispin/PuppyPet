DROP TABLE IF EXISTS movimiento_inventario;
DROP TABLE IF EXISTS hecho_venta;
DROP TABLE IF EXISTS dim_cliente_tipo;
DROP TABLE IF EXISTS dim_tiempo;
DROP TABLE IF EXISTS dim_producto;
DROP TABLE IF EXISTS dim_categoria;
DROP TABLE IF EXISTS documento_xml;
DROP TABLE IF EXISTS detalle_venta;
DROP TABLE IF EXISTS venta;
DROP TABLE IF EXISTS item_carrito;
DROP TABLE IF EXISTS carrito;
DROP TABLE IF EXISTS producto;
DROP TABLE IF EXISTS categoria;
DROP TABLE IF EXISTS cliente;
DROP TABLE IF EXISTS empresa_emisora;
DROP TABLE IF EXISTS usuario;


CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    rut TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    direccion TEXT NOT NULL,
    comuna TEXT NOT NULL,
    ciudad TEXT NOT NULL,
    rol TEXT DEFAULT 'CLIENTE',
    estado TEXT DEFAULT 'ACTIVO'
);

CREATE TABLE empresa_emisora (
    id_empresa INTEGER PRIMARY KEY AUTOINCREMENT,
    rut_emisor TEXT NOT NULL,
    razon_social TEXT NOT NULL,
    giro_emisor TEXT NOT NULL,
    correo_emisor TEXT,
    sucursal TEXT,
    direccion_origen TEXT NOT NULL,
    comuna_origen TEXT NOT NULL,
    ciudad_origen TEXT NOT NULL,
    estado TEXT DEFAULT 'ACTIVO'
);

CREATE TABLE cliente (
    id_cliente INTEGER PRIMARY KEY AUTOINCREMENT,
    rut TEXT,
    razon_social TEXT,
    giro TEXT,
    correo TEXT,
    telefono TEXT,
    direccion TEXT,
    comuna TEXT,
    ciudad TEXT,
    estado TEXT DEFAULT 'ACTIVO'
);

CREATE TABLE categoria (
    id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT DEFAULT 'ACTIVO'
);

CREATE TABLE producto (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo_interno TEXT NOT NULL UNIQUE,
    nombre_producto TEXT NOT NULL,
    descripcion TEXT,
    precio INTEGER NOT NULL,
    stock INTEGER NOT NULL,
    stock_critico INTEGER DEFAULT 5,
    stock_alerta INTEGER DEFAULT 10,
    imagen_url TEXT,
    estado TEXT DEFAULT 'ACTIVO',
    id_categoria INTEGER NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE movimiento_inventario (
    id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
    id_producto INTEGER NOT NULL,
    id_usuario INTEGER,
    tipo_movimiento TEXT NOT NULL,
    cantidad INTEGER NOT NULL,
    stock_anterior INTEGER NOT NULL,
    stock_nuevo INTEGER NOT NULL,
    motivo TEXT NOT NULL,
    observacion TEXT,
    fecha_movimiento TEXT DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE venta (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    id_cliente INTEGER,
    id_empresa INTEGER NOT NULL,
    tipo_documento TEXT NOT NULL,
    codigo_dte INTEGER DEFAULT 39,
    folio INTEGER,
    fecha_venta TEXT DEFAULT CURRENT_TIMESTAMP,
    subtotal INTEGER NOT NULL,
    iva INTEGER NOT NULL,
    total INTEGER NOT NULL,
    estado_venta TEXT DEFAULT 'GENERADA',
    xml_generado INTEGER DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_empresa) REFERENCES empresa_emisora(id_empresa)
);

CREATE TABLE detalle_venta (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    precio_unitario INTEGER NOT NULL,
    subtotal_linea INTEGER NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
);


CREATE TABLE dim_categoria (
    id_categoria INTEGER PRIMARY KEY,
    nombre_categoria TEXT NOT NULL
);

CREATE TABLE dim_producto (
    id_producto INTEGER PRIMARY KEY,
    codigo_interno TEXT,
    nombre_producto TEXT NOT NULL,
    precio_referencia INTEGER,
    estado TEXT
);

CREATE TABLE dim_tiempo (
    id_tiempo INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha TEXT NOT NULL UNIQUE,
    dia INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    anio INTEGER NOT NULL,
    nombre_mes TEXT NOT NULL
);

CREATE TABLE dim_cliente_tipo (
    id_cliente_tipo INTEGER PRIMARY KEY,
    tipo_cliente TEXT NOT NULL UNIQUE
);

CREATE TABLE hecho_venta (
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
    total_linea INTEGER NOT NULL,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES dim_producto(id_producto),
    FOREIGN KEY (id_categoria) REFERENCES dim_categoria(id_categoria),
    FOREIGN KEY (id_tiempo) REFERENCES dim_tiempo(id_tiempo),
    FOREIGN KEY (id_cliente_tipo) REFERENCES dim_cliente_tipo(id_cliente_tipo)
);

CREATE TABLE documento_xml (
    id_documento_xml INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    nombre_archivo TEXT NOT NULL,
    contenido_xml TEXT NOT NULL,
    fecha_generacion TEXT DEFAULT CURRENT_TIMESTAMP,
    estado_xml TEXT DEFAULT 'GENERADO',
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
);