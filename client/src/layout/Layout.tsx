import { Outlet } from "react-router-dom";
import Header from "./Header";
import { toast,  ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = () => {
  return (
    <div className=" bg-gray-100">
      <ToastContainer autoClose={3000}  toastStyle={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        color: '#374151',
        fontSize: '14px',
        fontWeight: '500',
        padding: '16px 20px',
        minHeight: '64px',
        margin: '8px 0',
      }}/>
      <Header />
      <main className="- min-h-[calc(100vh-64px)] quicksand ">
        <Outlet />
      </main>
      <footer className="bg-red-800 text-white text-center p-4 ">
        <p>&copy; 2025 CookBook. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;