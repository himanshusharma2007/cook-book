/**
 * Favorites page component displaying a user's favorite recipes.
 * Fetches favorite recipes on mount and allows unfavoriting or viewing details.
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFavorites } from '../redux/slices/favoritesSlice';
import type { RootState } from '../redux/store';
import Loader from '../components/common/Loader';
import RecipeCard from '../components/common/RecipeCard';

/**
 * Favorites page component.
 * @returns JSX.Element
 */
const Favorites = () => {
  const dispatch = useDispatch();
  const { recipes, loading, error } = useSelector(
    (state: RootState) => state.favorites
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch favorites on mount if user is logged in
  useEffect(() => {
    if (user) dispatch(getFavorites());
  }, [dispatch, user]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 pt-20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <h1 className="text-4xl merriweather font-bold text-gray-800 mb-8 text-center">
          Favorites
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.length > 0 ? (
            recipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                user={user}
                showDeleteButton={false}
                onViewDetails={() =>
                  (window.location.href = `/recipe/${recipe.id}`)
                }
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h3 className="text-xl merriweather font-semibold text-gray-700">
                No favorites yet
              </h3>
              <p className="text-gray-500">
                Add recipes to your favorites from the home page.
              </p>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Favorites;
