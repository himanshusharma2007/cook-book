import { NavLink } from "react-router-dom";
import { FaHome, FaPlus, FaHeart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
  const handleLogout = () => {
    // Placeholder for logout logic (to be integrated with backend later)
    toast.success("Logged out successfully!");
  };

  return (
    <header className="bg-gray-800 text-white h-16 px-20 flex justify-between items-center">
      <div className="text-xl font-bold">CookBook</div>
      <nav className="flex space-x-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center hover:text-gray-300 ${
              isActive ? "text-yellow-400" : ""
            }`
          }
          title="Home"
        >
          <FaHome className="mr-1" /> Home
        </NavLink>
        <NavLink
          to="/recipe-creator"
          className={({ isActive }) =>
            `flex items-center hover:text-gray-300 ${
              isActive ? "text-yellow-400" : ""
            }`
          }
          title="Create Recipe"
        >
          <FaPlus className="mr-1" /> Create
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `flex items-center hover:text-gray-300 ${
              isActive ? "text-yellow-400" : ""
            }`
          }
          title="Favorites"
        >
          <FaHeart className="mr-1" /> Favorites
        </NavLink>
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `flex items-center hover:text-gray-300 ${
              isActive ? "text-yellow-400" : ""
            }`
          }
          title="Login"
        >
          <FaUser className="mr-1" /> Login
        </NavLink>
        <NavLink
          to="/register"
          className={({ isActive }) =>
            `flex items-center hover:text-gray-300 ${
              isActive ? "text-yellow-400" : ""
            }`
          }
          title="Register"
        >
          <FaUser className="mr-1" /> Register
        </NavLink>
        <div
          className="flex items-center cursor-pointer hover:text-gray-300"
          onClick={handleLogout}
          title="Logout"
        >
          <FaSignOutAlt className="mr-1" /> Logout
        </div>
      </nav>
    </header>
  );
};

export default Header;