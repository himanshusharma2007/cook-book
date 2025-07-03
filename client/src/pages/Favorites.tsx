import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFavorites, removeFavorite } from "../redux/slices/favoritesSlice";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";
import { FaHeart, FaTrash } from "react-icons/fa";

const Favorites = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector((state: RootState) => state.favorites);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user) dispatch(getFavorites());
  }, [dispatch, user]);

  const handleUnfavorite = (id: number) => {
    dispatch(removeFavorite(id));
    toast.info(`Removed recipe ${id} from favorites!`);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.length > 0 ? (
            recipes.map((recipe) => (
              <div key={recipe.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                <img src={recipe.thumbnail} alt={recipe.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800">{recipe.name}</h3>
                  <p className="text-sm text-gray-600">By: {recipe.postedBy}</p>
                  <div className="flex justify-end mt-2 space-x-2">
                    <FaHeart className="text-red-500 cursor-pointer" onClick={() => handleUnfavorite(recipe.id)} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <h3 className="text-xl font-semibold text-gray-700">No favorites yet</h3>
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