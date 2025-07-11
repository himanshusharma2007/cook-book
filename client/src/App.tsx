import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeCreator from "./pages/RecipeCreator";
import Favorites from "./pages/Favorites";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe } from "./redux/slices/authSlice";
import RecipeDetails from "./pages/RecipeDetails";
import Loader from "./components/Loader";


// Protected route wrapper
// Fixed Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isInitialized } = useSelector((state: any) => state.auth);
  
  // Show loader while auth state is being initialized or during loading
  if (!isInitialized || loading) {
    return <Loader />;
  }
  
  // Only redirect to login after initialization is complete and user is null
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
const App = () => {
  const dispatch = useDispatch();
  const { loading, user, isInitialized } = useSelector((state: any) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);
console.log('isInitialized', isInitialized)
  // Show full page loader while initial authentication check is in progress
  if (!isInitialized || (loading && user === null)) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route 
            index 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="recipe-creator" 
            element={
              <ProtectedRoute>
                <RecipeCreator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="recipe/:id" 
            element={
              <ProtectedRoute>
                <RecipeDetails />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="favorites" 
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;