import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavorites, removeFavorite } from "../redux/slices/favoritesSlice";
import { deleteRecipe } from "../redux/slices/recipesSlice";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";
import { FaHeart, FaTrash } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import Loader from "../components/Loader";

const Favorites = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state: RootState) => state.favorites);
  const { user } = useSelector((state: RootState) => state.auth);
  console.log('user', user)
  useEffect(() => {
    if (user) dispatch(getFavorites());
  }, [dispatch, user]);

  const handleUnfavorite = (id: number) => {
    dispatch(removeFavorite(id));
    toast.info(`Removed recipe ${id} from favorites!`);
  };

  const handleDeleteRecipe = async (recipeId: number) => {
    if (!user) {
      toast.error("Please log in to delete recipes");
      return;
    }

    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await dispatch(deleteRecipe(recipeId)).unwrap();
        toast.success("Recipe deleted successfully");
      } catch (error) {
        toast.error("Failed to delete recipe");
      }
    }
  };
  const handleViewDetails = (recipeId: number) => {
    // Navigate to recipe details page
    window.location.href = `/recipe/${recipeId}`;
  };
  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-4xl merriweather font-bold text-gray-800 mb-8 text-center">Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white relative  rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col justify-between"
              >
                {/* <div className="absolute top-3 right-3 flex gap-2">
                  {user && user.id === recipe.postedBy && (
                    <button
                      onClick={() => handleDeleteRecipe(recipe.id)}
                      className="p-2 rounded-full bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div> */}
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}${recipe.thumbnail}`}
                  alt={recipe.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg merriweather font-semibold text-gray-800 mb-2 line-clamp-2">
                    {recipe.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">By: {recipe.postedBy}</p>
                  <div className="mt-auto flex flex-col justify-between gap-2">
                    <button
                      onClick={() => handleUnfavorite(recipe.id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl font-medium hover:bg-red-600 transition-all duration-200"
                    >
                      <FaHeart className="inline mr-2" /> Remove Favorite
                    </button>
                    <button
                      onClick={() => handleViewDetails(recipe.id)}
                      className="w-full bg-gradient-to-r  from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h3 className="text-xl merriweather font-semibold text-gray-700">No favorites yet</h3>
              <p className="text-gray-500">Add recipes to your favorites from the home page.</p>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Favorites;