/**
 * RecipeDetails page component displaying detailed information about a single recipe.
 * Includes favorite toggling, ingredient checklist, and delete functionality for owners.
 */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  ChefHat,
  Users,
  Calendar,
  ArrowLeft,
  Share2,
  CheckCircle,
  Circle,
  Trash2,
} from 'lucide-react';
import {
  getRecipeById,
  deleteRecipe,
  clearError,
} from '../redux/slices/recipesSlice';
import { getFavorites } from '../redux/slices/favoritesSlice';
import { toast } from 'react-toastify';
import type { RootState } from '../redux/store';
import { GiCook } from 'react-icons/gi';
import Loader from '../components/common/Loader';
import RecipeHeader from '../components/recipedetails/RecipeHeader';
import IngredientsSection from '../components/recipedetails/IngredientsSection';
import InstructionsSection from '../components/recipedetails/InstructionsSection';
import RecipeStats from '../components/recipedetails/RecipeStats';
import { useFavoriteToggle } from '../hooks/useFavoriteToggle';

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

/**
 * RecipeDetails page component.
 * @returns JSX.Element
 */
const RecipeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { loading, error } = useSelector((state: RootState) => state.recipes);
  const { user } = useSelector((state: RootState) => state.auth);
  const [recipe, setRecipe] = useState<RecipeDetailsType | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  // Initialize data on component mount
  useEffect(() => {
    if (id) {
      dispatch(getRecipeById(Number(id)))
        .unwrap()
        .then(recipeData => {
          setRecipe(recipeData);
          setCheckedIngredients(
            new Array(recipeData.ingredients.length).fill(false)
          );
          setIsOwner(user?.id === recipeData.postedBy);
        })
        .catch(() => {
          toast.error('Failed to load recipe details');
        });
    }
    if (user) {
      dispatch(getFavorites());
    }
  }, [dispatch, id, user]);

  /**
   * Handle ingredient checkbox toggle.
   * @param index - Index of the ingredient to toggle.
   */
  const handleIngredientToggle = (index: number) => {
    setCheckedIngredients(prev =>
      prev.map((checked, i) => (i === index ? !checked : checked))
    );
  };

  /**
   * Handle recipe deletion.
   */
  const handleDeleteRecipe = async () => {
    if (!recipe || !user) return;
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await dispatch(deleteRecipe(recipe.id)).unwrap();
        toast.success('Recipe deleted successfully');
        navigate('/');
      } catch (error) {
        toast.error('Failed to delete recipe');
      }
    }
  };

  /**
   * Handle sharing the recipe via navigator.share or clipboard.
   */
  const handleShare = async () => {
    if (!recipe) return;
    try {
      await navigator.share({
        title: recipe.name,
        text: `Check out this amazing recipe: ${recipe.name}`,
        url: window.location.href,
      });
    } catch {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Recipe link copied to clipboard!');
    }
  };

  /**
   * Format date string to a readable format.
   * @param dateString - ISO date string.
   * @returns Formatted date string.
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (loading && !recipe) {
    return <Loader />;
  }

  if (!recipe && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">
            Recipe not found
          </h2>
          <p className="text-gray-500 mb-6">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
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
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Recipes</span>
          </button>
        </div>
      </div>
      {recipe && (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <RecipeHeader
            recipe={recipe}
            user={user}
            onFavorite={() => useFavoriteToggle(recipe.id).toggleFavorite()}
            onShare={handleShare}
            onDelete={handleDeleteRecipe}
          />
          <div className="grid md:grid-cols-2 gap-8">
            <IngredientsSection
              ingredients={recipe.ingredients}
              checkedIngredients={checkedIngredients}
              onIngredientToggle={handleIngredientToggle}
            />
            <InstructionsSection instructions={recipe.instructions} />
          </div>
          <RecipeStats recipe={recipe} formatDate={formatDate} />
        </div>
      )}
    </div>
  );
};

export default RecipeDetails;