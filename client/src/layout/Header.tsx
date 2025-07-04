import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaPlus, FaHeart, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChefHat } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { FaUser } from "react-icons/fa6";
import { logoutUser } from "../redux/slices/authSlice";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // Add this line

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  // Determine if current route is index
  const isIndex = location.pathname === "/";

  return (
    <header
      className={`${
        isIndex ? "bg-transparent" : "bg-red-900"
      } absolute top-0 left-0 right-0 z-50 text-white h-20 px-4 md:px-8 lg:px-20 flex justify-between items-center shadow-lg`}
    >
      <div className="text-3xl md:text-4xl font-bold dancing-script relative">
        CookBook
      </div>
      <nav className="flex space-x-4 md:space-x-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
              isActive ? "text-yellow-400 " : ""
            }`
          }
          title="Home"
        >
          <FaHome className="mr-1 md:mr-2" /> Home
        </NavLink>
        <NavLink
          to="/recipe-creator"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
              isActive ? "text-yellow-400 " : ""
            }`
          }
          title="Create Recipe"
        >
          <FaPlus className="mr-1 md:mr-2" /> Create
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
              isActive ? "text-yellow-400 " : ""
            }`
          }
          title="Favorites"
        >
          <FaHeart className="mr-1 md:mr-2" /> Favorites
        </NavLink>
        {!user && (
          <>
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
                  isActive ? "text-yellow-400 " : ""
                }`
              }
              title="Login"
            >
              <FaUser className="mr-1 md:mr-2" /> Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
                  isActive ? "text-yellow-400 " : ""
                }`
              }
              title="Register"
            >
              <FaUser className="mr-1 md:mr-2" /> Register
            </NavLink>
          </>
        )}
        {user && (
          <div
            className="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:text-amber-400"
            onClick={handleLogout}
            title="Logout"
          >
            <FaSignOutAlt className="mr-1 md:mr-2" /> Logout
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;