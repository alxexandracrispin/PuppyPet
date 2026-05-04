INSERT INTO usuario (nombre, apellido, correo, password, rol)
VALUES ('Administrador', 'PuppyPet', 'admin@puppypet.cl', '123456', 'ADMIN');

INSERT INTO empresa_emisora (
    rut_emisor,
    razon_social,
    giro_emisor,
    correo_emisor,
    sucursal,
    direccion_origen,
    comuna_origen,
    ciudad_origen
)
VALUES (
    '76234567-8',
    'PuppyPet SPA',
    'Venta de alimentos y accesorios para mascotas',
    'contacto@puppypet.cl',
    'Casa Matriz',
    'Av. Principal 123',
    'Puente Alto',
    'Santiago'
);

INSERT INTO cliente (
    rut,
    razon_social,
    giro,
    correo,
    telefono,
    direccion,
    comuna,
    ciudad
)
VALUES (
    '66666666-6',
    'Consumidor Final',
    'Sin giro',
    'cliente@puppypet.cl',
    '999999999',
    'Sin dirección',
    'Puente Alto',
    'Santiago'
);

INSERT INTO categoria (nombre_categoria, descripcion)
VALUES 
('Perros', 'Alimentos y productos para perros'),
('Gatos', 'Alimentos y productos para gatos'),
('Snack', 'Snacks y premios para mascotas'),
('Accesorios', 'Accesorios para mascotas'),
('Higiene', 'Productos de higiene para mascotas'),
('Juguetes', 'Juguetes para mascotas');

INSERT INTO producto (
    codigo_interno,
    nombre_producto,
    descripcion,
    precio,
    stock,
    imagen_url,
    id_categoria
)
VALUES
-- PERROS
('PER001', 'Dog Chow Adulto 3kg', 'Alimento balanceado para perros adultos.', 11490, 20, '/assets/images/dogchow.avif', 1),
('PER002', 'Pedigree Cachorro 3kg', 'Ideal para crecimiento saludable.', 14990, 18, '/assets/images/pedigree.png', 1),
('PER003', 'Royal Canin Mini 3kg', 'Especial para razas pequeñas.', 24990, 12, '/assets/images/royal.webp', 1),
('PER004', 'Dog Chow Adulto 8kg', 'Alimento balanceado para perros adultos.', 22990, 16, '/assets/images/dogchow.avif', 1),
('PER005', 'Pedigree Cachorro 8kg', 'Ideal para crecimiento saludable.', 24990, 15, '/assets/images/pedigree.png', 1),
('PER006', 'Royal Canin Mini 8kg', 'Especial para razas pequeñas.', 34990, 10, '/assets/images/royal.webp', 1),
('PER007', 'Dog Chow Adulto 15kg', 'Alimento balanceado para perros adultos.', 32990, 14, '/assets/images/dogchow.avif', 1),
('PER008', 'Pedigree Cachorro 15kg', 'Ideal para crecimiento saludable.', 34990, 12, '/assets/images/pedigree.png', 1),
('PER009', 'Royal Canin Mini 15kg', 'Especial para razas pequeñas.', 44990, 8, '/assets/images/royal.webp', 1),

-- GATOS
('GAT001', 'Whiskas Adulto 3kg', 'Alimento balanceado para gatos adultos.', 10990, 22, '/assets/images/whiskas.avif', 2),
('GAT002', 'Cat Chow 3kg', 'Nutrición completa para gatos activos.', 11990, 20, '/assets/images/catchow.avif', 2),
('GAT003', 'Royal Canin Indoor 3kg', 'Ideal para gatos de interior.', 22990, 12, '/assets/images/royalcat.avif', 2),
('GAT004', 'Whiskas Adulto 8kg', 'Formato ahorro.', 19990, 18, '/assets/images/whiskas.avif', 2),
('GAT005', 'Cat Chow 8kg', 'Alta digestibilidad.', 21990, 16, '/assets/images/catchow.avif', 2),
('GAT006', 'Royal Canin Indoor 8kg', 'Nutrición premium.', 39990, 10, '/assets/images/royalcat.avif', 2),
('GAT007', 'Whiskas Adulto 15kg', 'Formato ahorro.', 29990, 12, '/assets/images/whiskas.avif', 2),
('GAT008', 'Cat Chow 15kg', 'Alta digestibilidad.', 31990, 10, '/assets/images/catchow.avif', 2),
('GAT009', 'Royal Canin Indoor 15kg', 'Nutrición premium.', 49990, 8, '/assets/images/royalcat.avif', 2),

-- SNACK
('SNA001', 'Snack Huesitos', 'Premio crujiente para perros.', 3990, 50, '/assets/images/snackhuesito.jpg', 3),
('SNA002', 'Galletas para Perro', 'Snack saludable y nutritivo.', 4990, 45, '/assets/images/galletas.webp', 3),
('SNA003', 'Premios para Gato', 'Snacks irresistibles para gatos.', 2990, 55, '/assets/images/snakgato.jpg', 3),
('SNA004', 'Snack Dental', 'Ayuda a la limpieza dental.', 5990, 40, '/assets/images/snackdental.webp', 3),
('SNA005', 'Barritas de Carne', 'Alta proteína para mascotas activas.', 5490, 35, '/assets/images/snackcarne.webp', 3),
('SNA006', 'Alimento Húmedo Perro', 'Alimento húmedo para perro adulto en lata.', 1990, 60, '/assets/images/snackhumedoperro.jpg', 3),
('SNA007', 'Snack para Perros', 'Snack mixtos para tu mascota.', 4990, 42, '/assets/images/mix.jpg', 3),
('SNA008', 'Barritas de Cartílago', 'Alta proteína para masticar.', 2490, 48, '/assets/images/cartilagoperro.jpg', 3),
('SNA009', 'Alimento Húmedo Gato', 'Alimento húmedo para gatos.', 3990, 50, '/assets/images/snackgatitotubo.webp', 3),

-- ACCESORIOS
('ACC001', 'Cama para mascotas', 'Camas de varias tallas y colores.', 3990, 20, '/assets/images/camaperro.webp', 4),
('ACC002', 'Rascador para gatos', 'Árbol Michi tipo palmera.', 14990, 15, '/assets/images/rascador.webp', 4),
('ACC003', 'Arnés para tu mascota', 'Variedad en talla y colores.', 2990, 30, '/assets/images/arnes.jpg', 4),
('ACC004', 'Camita para gatos', 'Cama iglú para gatos tipo nido cueva.', 11990, 12, '/assets/images/camaparagatos.webp', 4),
('ACC005', 'Platos para comida de perro', 'Plato para comer y enseñar.', 2490, 35, '/assets/images/platosperros.jpg', 4),
('ACC006', 'Bebedero para tu mascota', 'Fuente de agua eléctrica para perros y gatos.', 10990, 14, '/assets/images/bebedero.webp', 4),
('ACC007', 'Almohadillas', 'Almohadillas para cachorros, perros y gatos.', 4990, 25, '/assets/images/paños.webp', 4),
('ACC008', 'Transportador de mascotas', 'Transporta a tu mascota de forma segura.', 12490, 10, '/assets/images/transportador.jpg', 4),
('ACC009', 'Bolsas biodegradables', 'Bolsas biodegradables para recoger heces de mascotas con dispensador.', 13990, 28, '/assets/images/bolsas.webp', 4),

-- HIGIENE
('HIG001', 'Shampoo para Perros', 'Limpieza profunda y aroma agradable.', 5990, 22, '/assets/images/shampoperro.png', 5),
('HIG002', 'Shampoo para Gatos', 'Fórmula suave especial para gatos.', 6490, 20, '/assets/images/shampogato.png', 5),
('HIG003', 'Toallitas Húmedas', 'Limpieza rápida sin necesidad de agua.', 3990, 35, '/assets/images/toallahumeda.png', 5),
('HIG004', 'Arena Sanitaria', 'Control de olores para gatos.', 8990, 40, '/assets/images/arena.png', 5),
('HIG005', 'Cepillo para Mascotas', 'Elimina pelo muerto fácilmente.', 4990, 27, '/assets/images/cepillo.png', 5),
('HIG006', 'Corta Uñas', 'Seguro y fácil de usar.', 3490, 25, '/assets/images/cortaunas.png', 5),

-- JUGUETES
('JUG001', 'Pelota para Perros', 'Perfecta para juegos al aire libre.', 2990, 40, '/assets/images/pelota.png', 6),
('JUG002', 'Cuerda Mordedora', 'Ideal para juegos de fuerza.', 3990, 30, '/assets/images/cuerda.png', 6),
('JUG003', 'Ratón para Gatos', 'Estimula el instinto cazador.', 1990, 50, '/assets/images/raton.png', 6),
('JUG004', 'Puntero Láser', 'Diversión garantizada para gatos.', 2490, 35, '/assets/images/laser.png', 6),
('JUG005', 'Mordedor de Goma', 'Ayuda a la salud dental.', 4490, 28, '/assets/images/mordedor.png', 6),
('JUG006', 'Juguete con Plumas', 'Ideal para gatos activos.', 3490, 32, '/assets/images/pluma.png', 6);