import { FaHeart } from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
import type { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { useFavoriteToggle } from '../../hooks/useFavoriteToggle';
import clsx from 'clsx';

/**
 * Recipe interface for card display.
 */
interface Recipe {
  id: number;
  name: string;
  thumbnail: string;
  postedBy: number;
  user?: { name: string };
}

/**
 * Props for RecipeCard component.
 */
interface RecipeCardProps {
  recipe: Recipe;
  user: RootState['auth']['user'];
  showDeleteButton: boolean;
  onViewDetails: () => void;
  onDelete?: () => void;
}

/**
 * RecipeCard component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const RecipeCard = ({
  recipe,
  user,
  showDeleteButton,
  onViewDetails,
  onDelete,
}: RecipeCardProps) => {
  const favorites = useSelector((state: RootState) => state.favorites.recipes);
  const isFavorite = favorites.some(fav => fav.id === recipe.id);

  const { toggleFavorite } = useFavoriteToggle(recipe.id); // ✅ safe here

  return (
    <div className="bg-white relative rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col justify-between">
      <div className="relative">
        <img
          src={recipe.thumbnail}
          alt={recipe.name}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={toggleFavorite}
            className={clsx(
              'p-2 rounded-full bg-white transition-all duration-200',
              isFavorite
                ? 'text-red-500 hover:bg-red-100'
                : 'text-gray-600 hover:bg-red-50 hover:text-red-500'
            )}
          >
            <FaHeart className="w-5 h-5" />
          </button>
          {showDeleteButton && user && user.id === recipe.postedBy && (
            <button
              onClick={onDelete}
              className="p-2 rounded-full bg-white text-gray-600 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg merriweather font-semibold text-gray-800 mb-2 line-clamp-2">
          {recipe.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          By: {recipe.user?.name?.split(' ')[0] || 'Unknown'}
        </p>
        <div className="mt-auto flex flex-col justify-between gap-2">
          <button
            onClick={onViewDetails}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105"
          >
            View Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
