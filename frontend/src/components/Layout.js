import { Outlet } from "react-router-dom";
import NavbarPrincipal from "./NavbarPrincipal";
import Footer from "./Footer";

function Layout() {
  return (
    <>
      <NavbarPrincipal />

      <main className="min-vh-100">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default Layout;