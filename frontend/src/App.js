// Se importa el enrutador de React Router v6 que maneja la navegación sin recargar la página
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProductoDetalle from "./pages/ProductoDetalle";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import VentaConfirmada from "./pages/VentaConfirmada";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";

import Perfil from "./pages/MiPerfil";
import MisCompras from "./pages/MisCompras";
import AdminDashboard from "./admin/AdminDashboard";

import AdminInventario from "./admin/inventario/AdminInventario";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Las rutas de admin van sin Layout para tener su propio panel sin navbar ni footer */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/inventario" element={<AdminInventario />} />

        {/* Layout actúa como contenedor principal: renderiza Navbar, el contenido de la ruta activa (Outlet) y Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="catalogo" element={<Catalogo />} />
          <Route path="catalogo/:categoria" element={<Catalogo />} />

          <Route path="carrito" element={<Carrito />} />
          <Route path="venta-confirmada/:idVenta" element={<VentaConfirmada />} />

          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="mis-compras" element={<MisCompras />} />
          <Route path="nosotros" element={<Nosotros />} />

          <Route path="producto/:idProducto" element={<ProductoDetalle />} />

          {/* Ruta comodín: cualquier URL no reconocida redirige al inicio */}
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
