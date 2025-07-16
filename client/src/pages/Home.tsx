/**
 * Home page component displaying a list of recipes with search and filter functionality.
 * Allows users to toggle favorites, delete their own recipes, and load more recipes.
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRecipes,
  getMyRecipes,
  deleteRecipe,
  clearError,
} from '../redux/slices/recipesSlice';
import { getFavorites } from '../redux/slices/favoritesSlice';
import type { RootState } from '../redux/store';
import { toast } from 'react-toastify';
import Loader from '../components/common/Loader';
import SearchBar from '../components/common/SearchBar';
import RecipeCard from '../components/common/RecipeCard';
import LoadMoreButton from '../components/common/LoadMoreButton';
import { AppDispatch } from '../redux/store'; // Import AppDispatch
import { Recipe, RecipeResponse } from 'types';

/**
 * Home page component.
 * @returns JSX.Element
 */
const Home = () => {
  const dispatch = useDispatch<AppDispatch>(); // Use typed dispatch
  const { recipes, loading, error, total, page, limit } = useSelector(
    (state: RootState) => state.recipes
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  console.log('recipes', recipes)
  // Initialize data on component mount
  useEffect(() => {
    dispatch(getRecipes({ search: '', page: 1, limit: 8 }));
    if (user) {
      dispatch(getFavorites());
    }
  }, [dispatch, user]);

  // Handle search with debounce
  const handleSearch = (term: string, filter: string) => {
    setSearchTerm(term);
    setActiveFilter(filter);
    const action = filter === 'all' ? getRecipes : getMyRecipes;
    dispatch(action({ search: term, page: 1, limit: 8 }));
  };

  // Handle delete recipe
  const handleDeleteRecipe = async (recipeId: number) => {
    if (!user) {
      toast.error('Please log in to delete recipes');
      return;
    }
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await dispatch(deleteRecipe(recipeId)).unwrap();
        toast.success('Recipe deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete recipe');
      }
    }
  };

  // Handle load more recipes
  const handleLoadMore = () => {
    const nextPage = page + 1;
    const action = activeFilter === 'all' ? getRecipes : getMyRecipes;
    dispatch(action({ search: searchTerm, page: nextPage, limit }));
  };

  // Clear error on component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative h-[70vh] bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop')`,
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            minHeight: "50vh",
          }}
        ></div>
        <div className="relative flex justify-center items-center h-full  z-10 ">
          <div className="wraper w-full md:mt-32 flex flex-col items-center justify-center text-center px-4 ">

          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg dancing-script">
              CookBook
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-90 max-w-2xl mx-auto drop-shadow-md">
              Discover and share amazing recipes from around the world
            </p>
          </div>
          <SearchBar
            searchTerm={searchTerm}
            activeFilter={activeFilter}
            onSearch={handleSearch}
          />
          </div>
        </div>
      </div>

      {/* Recipe Cards Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl merriweather font-bold text-gray-800 mb-2">
            {activeFilter === 'all' ? 'All Recipes' : 'My Recipes'}
          </h2>
          <p className="text-gray-600">
            {total > 0 ? `${total} recipes found` : 'No recipes found'}
          </p>
        </div>
        {loading && recipes.length === 0 && <Loader />}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipeResponse: RecipeResponse) => {
            const recipe: Recipe = {
              id: recipeResponse.id,
              name: recipeResponse.name,
              thumbnail: recipeResponse.thumbnail,
              postedBy: recipeResponse.postedBy,
              instructions: recipeResponse.instructions,
              ingredients: recipeResponse.ingredients,
              user: recipeResponse.user,
            };
            return (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                user={user}
                showDeleteButton={activeFilter === 'my'}
                onViewDetails={() =>
                  (window.location.href = `/recipe/${recipe.id}`)
                }
                onDelete={() => handleDeleteRecipe(recipe.id)}
              />
            );
          })}
        </div>
        {recipes.length < total && (
          <LoadMoreButton loading={loading} onLoadMore={handleLoadMore} />
        )}
      </div>
    </div>
  );
};

export default Home;
