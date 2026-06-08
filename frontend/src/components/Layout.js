import { Outlet } from "react-router-dom";
import NavbarPrincipal from "./NavbarPrincipal";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <NavbarPrincipal />

      {/* Outlet renderiza la página correspondiente a la ruta activa en ese momento */}
      <main className="min-vh-100">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;
