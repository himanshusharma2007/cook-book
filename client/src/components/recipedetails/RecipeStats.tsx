/**
 * RecipeStats component for displaying recipe metadata (e.g., author, dates).
 * Used in RecipeDetails page to show recipe details.
 */
import { GiCook } from 'react-icons/gi';
import { Calendar, Users } from 'lucide-react';

/**
 * Recipe interface for stats display.
 */
interface Recipe {
  postedAt: string;
  createdAt: string;
  updatedAt: string;
  user?: { name: string };
}

/**
 * Props for RecipeStats component.
 */
interface RecipeStatsProps {
  recipe: Recipe;
  formatDate: (dateString: string) => string;
}

/**
 * RecipeStats component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const RecipeStats = ({ recipe, formatDate }: RecipeStatsProps) => {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl merriweather font-semibold text-gray-800 mb-4">
        Recipe Details
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Created by</p>
            <p className="font-medium text-gray-800 capitalize">
              {recipe.user?.name || 'Unknown'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <GiCook className="w-6 h-6 text-orange-500" />
          <div>
            <p className="text-sm text-gray-500">Posted on</p>
            <p className="font-medium text-gray-800">
              {formatDate(recipe.postedAt)}
            </p>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default RecipeStats;
