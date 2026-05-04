import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import VentaConfirmada from "./pages/VentaConfirmada";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Nosotros from "./pages/Nosotros";
import Contacto from "./pages/Contacto";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="catalogo" element={<Catalogo />} />
          <Route path="catalogo/:categoria" element={<Catalogo />} />

          <Route path="carrito" element={<Carrito />} />
          <Route path="venta-confirmada/:idVenta" element={<VentaConfirmada />} />

          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="contacto" element={<Contacto />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;