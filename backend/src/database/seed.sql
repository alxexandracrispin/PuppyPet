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
('PER001', 'Alimento perro adulto 3kg', 'Alimento seco para perro adulto', 12990, 20, '/assets/images/dogchow.avif', 1),
('PER002', 'Alimento cachorro 2kg', 'Alimento seco para cachorro', 10990, 15, '/assets/images/pedigree.png', 1),
('PER003', 'Correa ajustable para perro', 'Correa resistente ajustable', 6990, 30, '/assets/images/arnes.jpg', 1),

('GAT001', 'Alimento gato adulto 3kg', 'Alimento seco para gato adulto', 11990, 25, '/assets/images/catchow.avif', 2),
('GAT002', 'Arena sanitaria 10kg', 'Arena sanitaria para gatos', 8990, 40, '/assets/images/gato10kg.webp', 2),
('GAT003', 'Rascador pequeño', 'Rascador básico para gato', 14990, 10, '/assets/images/rascador.webp', 2),

('SNA001', 'Snack dental perro', 'Snack dental para limpieza bucal', 3990, 50, '/assets/images/snackdental.webp', 3),
('SNA002', 'Premios sabor pollo', 'Premios blandos sabor pollo', 2990, 60, '/assets/images/latapollo.webp', 3),
('SNA003', 'Snack gato salmón', 'Snack para gato sabor salmón', 2490, 45, '/assets/images/snackgatitotubo.webp', 3),

('ACC001', 'Plato plástico mediano', 'Plato para agua o comida', 2990, 35, '/assets/images/platosperros.jpg', 4),
('ACC002', 'Cama mascota mediana', 'Cama acolchada para mascota', 19990, 12, '/assets/images/camaperro.webp', 4),
('ACC003', 'Arnés para perro', 'Arnés ajustable talla M', 9990, 18, '/assets/images/arnes.jpg', 4),

('HIG001', 'Shampoo para perro', 'Shampoo suave para perro', 5990, 22, '/assets/images/higiene.webp', 5),
('HIG002', 'Toallitas húmedas', 'Toallitas de limpieza para mascotas', 3490, 33, '/assets/images/paños.webp', 5),
('HIG003', 'Bolsas higiénicas', 'Bolsas para limpieza de mascotas', 4990, 27, '/assets/images/bolsas.webp', 5),

('JUG001', 'Pelota de goma', 'Pelota resistente para perro', 2990, 40, '/assets/images/juguetes.jpg', 6),
('JUG002', 'Juguete para gato', 'Juguete pequeño para gato', 1990, 50, '/assets/images/gato.png', 6),
('JUG003', 'Mix de juguetes', 'Set de juguetes para mascotas', 3990, 30, '/assets/images/mix.jpg', 6);