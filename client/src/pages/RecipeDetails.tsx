import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Heart, 
  ChefHat, 
  Clock, 
  Users, 
  Calendar,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle,
  Circle,
  Trash2,
  Edit
} from "lucide-react";
import { getRecipeById, deleteRecipe, clearError } from "../redux/slices/recipesSlice";
import { addFavorite, removeFavorite, getFavorites } from "../redux/slices/favoritesSlice";
import { toast } from "react-toastify";
import type { RootState } from "../redux/store";
import { GiCook } from "react-icons/gi";
import Loader from "../components/Loader";

interface RecipeDetailsType {
  id: number;
  name: string;
  instructions: string;
  ingredients: string[];
  thumbnail: string;
  postedAt: string;
  postedBy: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
  };
}

const RecipeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Redux state
  const { loading, error } = useSelector((state: RootState) => state.recipes);
  const { user } = useSelector((state: RootState) => state.auth);
  const { recipes: favoriteRecipes } = useSelector((state: RootState) => state.favorites);
  
  // Local state
  const [recipe, setRecipe] = useState<RecipeDetailsType | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    if (id) {
      dispatch(getRecipeById(Number(id)))
        .unwrap()
        .then((recipeData) => {
          setRecipe(recipeData);
          setCheckedIngredients(new Array(recipeData.ingredients.length).fill(false));
          setIsOwner(user?.id === recipeData.postedBy);
        })
        .catch((error) => {
          console.error("Failed to fetch recipe:", error);
          toast.error("Failed to load recipe details");
        });
    }

    if (user) {
      dispatch(getFavorites());
    }
  }, [dispatch, id, user]);

  // Update favorite status when favorites change
  useEffect(() => {
    if (recipe) {
      setIsFavorite(favoriteRecipes.some(favRecipe => favRecipe.id === recipe.id));
    }
  }, [favoriteRecipes, recipe]);

  // Handle ingredient checkbox toggle
  const handleIngredientToggle = (index: number) => {
    setCheckedIngredients(prev => 
      prev.map((checked, i) => i === index ? !checked : checked)
    );
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast.error("Please log in to add favorites");
      return;
    }

    if (!recipe) return;

    try {
      if (isFavorite) {
        await dispatch(removeFavorite(recipe.id)).unwrap();
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await dispatch(addFavorite(recipe.id)).unwrap();
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  // Handle delete recipe
  const handleDeleteRecipe = async () => {
    if (!recipe || !user) return;

    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        await dispatch(deleteRecipe(recipe.id)).unwrap();
        toast.success("Recipe deleted successfully");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete recipe");
      }
    }
  };

  // Handle share recipe
  const handleShare = async () => {
    if (!recipe) return;

    try {
      await navigator.share({
        title: recipe.name,
        text: `Check out this amazing recipe: ${recipe.name}`,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success("Recipe link copied to clipboard!");
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate completion percentage
  const completionPercentage = checkedIngredients.length > 0 
    ? Math.round((checkedIngredients.filter(Boolean).length / checkedIngredients.length) * 100)
    : 0;

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Loading state
  if (loading && !recipe) {
    return (
      <Loader />
    );
  }

  // Error state
  if (!recipe && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Recipe not found</h2>
          <p className="text-gray-500 mb-6">The recipe you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/")}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Recipes</span>
          </button>
        </div>
      </div>

      {recipe && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Recipe Header */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative">
              <img
                src={recipe.thumbnail}
                alt={recipe.name}
                className="w-full h-64 md:h-96 object-cover"
              />
              
              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={handleFavoriteToggle}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    isFavorite
                      ? "bg-red-500 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? "fill-current" : ""}`}
                  />
                </button>
                
                <button
                  onClick={handleShare}
                  className="p-3 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-500 transition-all duration-200"
                >
                  <Share2 className="w-6 h-6" />
                </button>
                
                {isOwner && (
                  <>
                  
                    
                    <button
                      onClick={handleDeleteRecipe}
                      className="p-3 rounded-full bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {/* Recipe Info */}
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 dancing-script">
                {recipe.name}
              </h1>
              
              {/* Recipe Meta */}
              <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span>By {recipe.user?.name || "Unknown Chef"}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Posted {formatDate(recipe.postedAt)}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5" />
                  <span>{recipe.ingredients.length} ingredients</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Ingredients Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 merriweather">
                  Ingredients
                </h2>
                <div className="text-sm text-gray-600">
                  {completionPercentage}% complete
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              
              {/* Ingredients List */}
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      checkedIngredients[index]
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-gray-50 border-gray-200 hover:border-orange-200"
                    }`}
                    onClick={() => handleIngredientToggle(index)}
                  >
                    {checkedIngredients[index] ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-lg ${
                        checkedIngredients[index] ? "line-through" : ""
                      }`}
                    >
                      {ingredient}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 merriweather">
                Instructions
              </h2>
              
              <div className="prose prose-gray max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap"  dangerouslySetInnerHTML={{ __html: recipe.instructions }}/>

              </div>
            </div>
          </div>

          {/* Recipe Stats */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 merriweather">
              Recipe Information
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <ChefHat className="w-8 h-8 text-orange-500 mx-auto mb-2" />

                <div className="text-2xl font-bold text-gray-800">
                  {recipe.ingredients.length}
                </div>
                <div className="text-gray-600">Ingredients</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-xl">
                <Calendar className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-800">
                  {formatDate(recipe.postedAt)}
                </div>
                <div className="text-gray-600">Posted</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <GiCook className="w-8 h-8 text-green-500 mx-auto mb-2" />

                <div className="text-2xl font-bold text-gray-800">
                  {recipe.user?.name?.split(' ')[0] || 'Chef'}
                </div>
                <div className="text-gray-600">Created by</div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default RecipeDetails;