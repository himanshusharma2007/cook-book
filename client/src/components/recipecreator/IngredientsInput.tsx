/**
 * IngredientsInput component for managing recipe ingredients.
 * Supports adding and removing ingredients with validation.
 */
import { useFormContext } from 'react-hook-form';
import { FaList, FaPlus, FaTimes } from 'react-icons/fa';

/**
 * Props for IngredientsInput component.
 */
interface IngredientsInputProps {
  fields: { id: string; value: string }[];
  append: (value: { value: string }) => void;
  remove: (index: number) => void;
  register: ReturnType<typeof useFormContext>['register'];
  errors: ReturnType<typeof useFormContext>['formState']['errors'];
}

/**
 * IngredientsInput component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const IngredientsInput = ({
  fields,
  append,
  remove,
  register,
  errors,
}: IngredientsInputProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <label className="flex items-center text-lg merriweather font-semibold text-gray-700 mb-4">
        <FaList className="mr-2 text-orange-500" />
        Ingredients
      </label>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 font-medium text-sm">
                {index + 1}
              </span>
            </div>
            <input
              type="text"
              placeholder={`Ingredient ${index + 1}`}
              {...register(`ingredients.${index}.value`)}
              className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="flex-shrink-0 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <FaTimes className="text-red-600 text-sm" />
              </button>
            )}
            {errors.ingredients?.[index]?.value && (
              <p className="text-red-500 text-sm mt-1">
                {errors.ingredients[index].value.message}
              </p>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ value: '' })}
          className="flex items-center justify-center w-full p-3 border-2 border-dashed border-orange-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-orange-600 font-medium"
        >
          <FaPlus className="mr-2" />
          Add Ingredient
        </button>
      </div>
      {errors.ingredients && !errors.ingredients[0] && (
        <p className="text-red-500 text-sm mt-1">
          {errors.ingredients.message}
        </p>
      )}
    </div>
  );
};

export default IngredientsInput;
