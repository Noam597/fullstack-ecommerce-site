// Layout.tsx
import { Outlet } from "react-router-dom";
// your navbar component
import Navbar from "./pages/navbar/Navbar";
import Footer from "./components/footer/Footer";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="pt-16 flex-grow">{/* add padding to avoid overlap with fixed navbar */}
        <Outlet />
      </main>
      <Footer/>
    </div>
  );
};

export default Layout;
