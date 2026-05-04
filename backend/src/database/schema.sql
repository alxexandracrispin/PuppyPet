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

CREATE TABLE usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rol TEXT NOT NULL,
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
    imagen_url TEXT,
    estado TEXT DEFAULT 'ACTIVO',
    id_categoria INTEGER NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE venta (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
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

CREATE TABLE documento_xml (
    id_documento_xml INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER NOT NULL,
    nombre_archivo TEXT NOT NULL,
    contenido_xml TEXT NOT NULL,
    fecha_generacion TEXT DEFAULT CURRENT_TIMESTAMP,
    estado_xml TEXT DEFAULT 'GENERADO',
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta)
);