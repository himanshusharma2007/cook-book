import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaPlus,
  FaHeart,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../redux/store';
import { FaUser } from 'react-icons/fa6';
import { logout } from '../redux/slices/authSlice';

const Header = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    navigate('/login');
    setDrawerOpen(false);
  };

  const isIndex = location.pathname === '/';

  // Navigation links as a component for reuse
  const navLinks = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
            isActive ? 'text-yellow-400 ' : ''
          }`
        }
        title="Home"
        onClick={() => setDrawerOpen(false)}
      >
        <FaHome className="mr-1 md:mr-2" /> Home
      </NavLink>
      <NavLink
        to="/recipe-creator"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
            isActive ? 'text-yellow-400 ' : ''
          }`
        }
        title="Create Recipe"
        onClick={() => setDrawerOpen(false)}
      >
        <FaPlus className="mr-1 md:mr-2" /> Create
      </NavLink>
      <NavLink
        to="/favorites"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
            isActive ? 'text-yellow-400 ' : ''
          }`
        }
        title="Favorites"
        onClick={() => setDrawerOpen(false)}
      >
        <FaHeart className="mr-1 md:mr-2" /> Favorites
      </NavLink>
      {!user && (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
                isActive ? 'text-yellow-400 ' : ''
              }`
            }
            title="Login"
            onClick={() => setDrawerOpen(false)}
          >
            <FaUser className="mr-1 md:mr-2" /> Login
          </NavLink>
          <NavLink
            to="/register"
            className={({ isActive }) =>
              `flex items-center px-3 py-2 rounded-lg transition-all duration-200 hover:text-amber-400 ${
                isActive ? 'text-yellow-400 ' : ''
              }`
            }
            title="Register"
            onClick={() => setDrawerOpen(false)}
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
    </>
  );

  return (
    <header
      className={`${
        isIndex ? 'bg-transparent' : 'bg-red-900'
      } absolute top-0 left-0 right-0 z-50 text-white h-20 px-4 md:px-8 lg:px-20 flex justify-between items-center shadow-lg`}
    >
      <div className="text-3xl md:text-4xl font-bold dancing-script relative">
        CookBook
      </div>
      {/* Hamburger for mobile */}
      <button
        className="md:hidden text-2xl focus:outline-none"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open menu"
      >
        <FaBars />
      </button>
      {/* Desktop nav */}
      <nav className="hidden md:flex space-x-4 md:space-x-6">{navLinks}</nav>
      {/* Drawer for mobile */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setDrawerOpen(false)}
          ></div>
          {/* Drawer */}
          <div className="relative bg-red-900 w-64 h-full shadow-lg flex flex-col p-6 animate-slide-in-left">
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
            <div className="text-3xl font-bold mb-8 mt-2 dancing-script">
              CookBook
            </div>
            <nav className="flex flex-col space-y-4">{navLinks}</nav>
          </div>
        </div>
      )}
      {/* Drawer animation */}
      <style>
        {`
          @keyframes slide-in-left {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          .animate-slide-in-left {
            animation: slide-in-left 0.2s ease;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
