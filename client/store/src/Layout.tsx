// Layout.tsx
import { Outlet } from "react-router-dom";
// your navbar component
import Navbar from "./pages/navbar/Navbar";
import Footer from "./components/footer/Footer";

const Layout: React.FC = () => {
  return (
    <>
      <Navbar/>
      <main className="pt-16">{/* add padding to avoid overlap with fixed navbar */}
        <Outlet />
      </main>
      <Footer/>
    </>
  );
};

export default Layout;
