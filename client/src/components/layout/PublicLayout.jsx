import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
