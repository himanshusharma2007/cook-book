import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecipeCreator from "./pages/RecipeCreator";
import Favorites from "./pages/Favorites";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getMe } from "./redux/slices/authSlice";
import RecipeDetails from "./pages/RecipeDetails";

const App = () => {
  const dispatch = useDispatch()
  // All routes are protected through api.ts, so we need to check if the user is logged in
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch])
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipe-creator" element={<RecipeCreator />} />
          <Route path="recipe/:id" element={<RecipeDetails />} />
          <Route path="favorites" element={<Favorites />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;