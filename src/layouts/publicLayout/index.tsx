import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function PublicLayout() {
  return (
    <div className="bg-secondary">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PublicLayout;
