import { Outlet } from "react-router-dom";
import Header from "./Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div className=" bg-gray-100">
      <Header />
      <main className="max-w-6xl mx-auto  p-4 min-h-[calc(100vh-64px)] ">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white text-center p-4 ">
        <p>&copy; 2025 CookBook. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;