// Punto de entrada de la aplicación React.
// Se importa Bootstrap globalmente para que sus estilos estén disponibles en todos los componentes
import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import App from "./App";

// React.StrictMode activa advertencias adicionales en desarrollo
// para detectar efectos secundarios y código obsoleto
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
