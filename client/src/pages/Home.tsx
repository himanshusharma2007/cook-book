import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRecipes } from "../redux/slices/recipesSlice";
import { getMe } from "../redux/slices/authSlice";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";

const Home = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state: RootState) => state.recipes);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getRecipes({ search: "", page: 1, limit: 12 }));
    if (!user) dispatch(getMe());
  }, [dispatch, user]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Recipe Collection</h1>
        <p className="text-gray-600 text-lg mb-8 text-center">Discover and share amazing recipes from around the world</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                <img src={`${import.meta.env.VITE_BACKEND_URL}${recipe.thumbnail}`} alt={recipe.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                  <p className="text-sm text-gray-600">By: {recipe.postedBy}</p>
                  <button className="mt-2 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600">View Recipe</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-xl font-semibold text-gray-700">No recipes found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Home;