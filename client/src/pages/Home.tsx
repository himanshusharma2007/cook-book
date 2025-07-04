import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Heart, ChefHat, Users, Clock, Star, Plus, ChevronDown, Trash2 } from "lucide-react";
import { getRecipes, getMyRecipes, deleteRecipe, clearError } from "../redux/slices/recipesSlice";
import { getMe } from "../redux/slices/authSlice";
import { addFavorite, removeFavorite, getFavorites } from "../redux/slices/favoritesSlice";
import { toast } from "react-toastify";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { recipes, loading, error, total, page, limit } = useSelector((state: RootState) => state.recipes);
  const { user } = useSelector((state: RootState) => state.auth);
  const { recipes: favoriteRecipes } = useSelector((state: RootState) => state.favorites);
  const navigate = useNavigate();
  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<number[]>([]);

  // Update local favorites state when Redux favorites change
  useEffect(() => {
    setFavoriteRecipeIds(favoriteRecipes.map(recipe => recipe.id));
  }, [favoriteRecipes]);

  // Initialize data on component mount
  useEffect(() => {
    dispatch(getRecipes({ search: "", page: 1, limit: 8 }));
    
    if (user) {
      dispatch(getFavorites());
    }
  }, [dispatch, user]);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (activeFilter === "all") {
        dispatch(getRecipes({ search: searchTerm, page: 1, limit: 8 }));
      } else if (activeFilter === "my") {
        dispatch(getMyRecipes({ page: 1, limit: 8 }));
      }
    }, 500);

    setSearchTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [searchTerm, activeFilter, dispatch]);

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setSearchTerm(""); // Clear search when switching filters
    setIsDropdownOpen(false); // Close dropdown
    
    if (filter === "all") {
      dispatch(getRecipes({ search: "", page: 1, limit: 8 }));
    } else if (filter === "my") {
      dispatch(getMyRecipes({ page: 1, limit: 8 }));
    }
  };

  // Handle add/remove favorite
  const handleFavoriteToggle = async (recipeId: number) => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    const isFavorite = favoriteRecipeIds.includes(recipeId);
    
    try {
      if (isFavorite) {
        await dispatch(removeFavorite(recipeId)).unwrap();
        setFavoriteRecipeIds(prev => prev.filter(id => id !== recipeId));
        toast.success("Removed from favorites");
      } else {
        await dispatch(addFavorite(recipeId)).unwrap();
        setFavoriteRecipeIds(prev => [...prev, recipeId]);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  // Handle delete recipe
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

  // Handle view recipe details
  const handleViewDetails = (recipeId: number) => {
    // Navigate to recipe details page
    window.location.href = `/recipe/${recipeId}`;
  };

  // Handle load more recipes
  const handleLoadMore = () => {
    const nextPage = page + 1;
    if (activeFilter === "all") {
      dispatch(getRecipes({ search: searchTerm, page: nextPage, limit }));
    } else if (activeFilter === "my") {
      dispatch(getMyRecipes({ page: nextPage, limit }));
    }
  };

  // Check if recipe is in favorites
  const isRecipeFavorite = (recipeId: number) => {
    return favoriteRecipeIds.includes(recipeId);
  };

  // Get filter options
  const getFilterOptions = () => [
    { value: "all", label: "All Recipes" },
    { value: "my", label: "My Recipes" }
  ];

  // Get current filter label
  const getCurrentFilterLabel = () => {
    const option = getFilterOptions().find(opt => opt.value === activeFilter);
    return option ? option.label : "All Recipes";
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
      <div className="relative h-96 md:h-[70vh] bg-gradient-to-r from-orange-600 to-red-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=600&fit=crop')`
          }}
        ></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg dancing-script">
              CookBook
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-90 max-w-2xl mx-auto drop-shadow-md">
              Discover and share amazing recipes from around the world
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white  shadow-2xl  backdrop-blur-sm bg-opacity-95">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search any recipe..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 focus:outline-none  focus:border-transparent text-gray-700 placeholder-gray-400"
                  />
                </div>

                {/* Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 min-w-[140px]"
                  >
                    <span className="font-medium">{getCurrentFilterLabel()}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute  top-full left-0 mt-2 w-full bg-white  shadow-lg border border-gray-200 overflow-hidden z-50">
                      {getFilterOptions().map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFilterChange(option.value)}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                            activeFilter === option.value ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Cards Section */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl merriweather font-bold text-gray-800 mb-2">
            {activeFilter === "all" ? "All Recipes" : "My Recipes"}
          </h2>
          <p className="text-gray-600">
            {total > 0 ? `${total} recipes found` : "No recipes found"}
          </p>
        </div>

        {/* Loading State */}
        {loading && recipes.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        )}

        {/* Recipe Grid */}
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white overflow-clip flex  flex-col justify-between  rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                {/* Recipe Image */}
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}${recipe.thumbnail}`}
                    alt={recipe.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* Favorite Button */}
                    <button
                      onClick={() => handleFavoriteToggle(recipe.id)}
                      className={`p-2 rounded-full transition-all duration-200 ${
                        isRecipeFavorite(recipe.id)
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isRecipeFavorite(recipe.id) ? "fill-current" : ""
                        }`}
                      />
                    </button>
                    
                    {/* Delete Button (only for My Recipes) */}
                    {activeFilter === "my" && (
                      <button
                        onClick={() => handleDeleteRecipe(recipe.id)}
                        className="p-2 rounded-full bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Recipe Info */}
                <div className="p-4">
                  <h3 className="text-lg text-nowrap font-semibold text-gray-800 mb-2 line-clamp-2">
                    {recipe.name}
                  </h3>
                  
                  {/* Recipe Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {console.log('recipe', recipe)}
                      <span>By {recipe?.user?.name?.split(" ")[0]}</span>
                    </div>
                  </div>

                 {/* Action Button */}
                  <button
                    onClick={() => handleViewDetails(recipe.id)}
                    className="w-full bg-gradient-to-r  from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
                  >
                    View Recipe
                  </button>
                </div>
                 
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="text-center py-20">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No recipes found
              </h3>
              <p className="text-gray-500 mb-6">
                {activeFilter === "my" 
                  ? "You haven't created any recipes yet." 
                  : "Try adjusting your search or filters."
                }
              </p>
              {activeFilter === "my" && (
                <button onClick={()=> navigate("/recipe-creator")} className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create Your First Recipe
                </button>
              )}
            </div>
          )
        )}

        {/* Load More Button */}
        {recipes.length > 0 && recipes.length < total && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-white text-orange-500 border-2 border-orange-500 px-8 py-3 rounded-xl font-medium hover:bg-orange-500 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Load More Recipes"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;