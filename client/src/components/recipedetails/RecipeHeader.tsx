/**
 * RecipeHeader component for displaying recipe image and action buttons.
 * Used in RecipeDetails page for favorite, share, and delete actions.
 */
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Share2, Trash2 } from 'lucide-react';
import type { RootState } from '../../redux/store';
import { useFavoriteToggle } from '../../hooks/useFavoriteToggle';
/**
 * Recipe interface for header display.
 */
interface Recipe {
  id: number;
  name: string;
  thumbnail: string;
  postedBy: number;
}

/**
 * Props for RecipeHeader component.
 */
interface RecipeHeaderProps {
  recipe: Recipe;
  user: RootState['auth']['user'];
  onShare: () => void;
  onDelete: () => void;
}

/**
 * RecipeHeader component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const RecipeHeader = ({
  recipe,
  user,
  onShare,
  onDelete,
}: RecipeHeaderProps) => {
  const dispatch = useDispatch();
  const { toggleFavorite } = useFavoriteToggle(recipe.id);
  const favorites = useSelector((state: RootState) => state.favorites.recipes);
  const isFavorite = favorites.some(fav => fav.id === recipe.id);

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(recipe.id));
  };

  return (
    <div className="mb-8">
      <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={recipe.thumbnail}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/50 to-transparent">
          <h1 className="text-3xl md:text-4xl dancing-script font-bold text-white drop-shadow-lg p-2">
            {recipe.name}
          </h1>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleFavoriteToggle}
            className={`p-3 rounded-full bg-white shadow-md hover:bg-orange-50 transition-all duration-200 ${
              isFavorite ? 'text-red-500' : 'text-gray-600'
            }`}
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={onShare}
            className="p-3 rounded-full bg-white shadow-md text-gray-600 hover:bg-orange-50 transition-all duration-200"
          >
            <Share2 className="w-6 h-6" />
          </button>
          {user && user.id === recipe.postedBy && (
            <button
              onClick={onDelete}
              className="p-3 rounded-full bg-white shadow-md text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeHeader;
