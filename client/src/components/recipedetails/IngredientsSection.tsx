/**
 * IngredientsSection component for displaying recipe ingredients with checkboxes.
 * Used in RecipeDetails page to allow users to check off ingredients.
 */
import { CheckCircle, Circle } from 'lucide-react';

/**
 * Props for IngredientsSection component.
 */
interface IngredientsSectionProps {
  ingredients: string[];
  checkedIngredients: boolean[];
  onIngredientToggle: (index: number) => void;
}

/**
 * IngredientsSection component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const IngredientsSection = ({
  ingredients,
  checkedIngredients,
  onIngredientToggle,
}: IngredientsSectionProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-2xl merriweather font-semibold text-gray-800 mb-4">
        Ingredients
      </h2>
      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <li
            key={index}
            className="flex items-center gap-3 text-gray-700 hover:bg-orange-50 p-2 rounded-lg transition-colors duration-200 cursor-pointer"
            onClick={() => onIngredientToggle(index)}
          >
            {checkedIngredients[index] ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <span
              className={
                checkedIngredients[index] ? 'line-through text-gray-500' : ''
              }
            >
              {ingredient}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientsSection;
