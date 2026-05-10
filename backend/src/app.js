const usuarioRoutes = require("./routes/usuarioRoutes");
const express = require("express");
const cors = require("cors");

const productoRoutes = require("./routes/productoRoutes");
const categoriaRoutes = require("./routes/categoriaRoutes");
const ventaRoutes = require("./routes/ventaRoutes");
const adminRoutes = require("./routes/adminRoutes");

const inventarioRoutes = require("./routes/inventarioRoutes");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensaje: "API PuppyPet funcionando correctamente",
    version: "1.0.0"
  });
});

app.use("/api/productos", productoRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/inventario", inventarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});