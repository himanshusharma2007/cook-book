/**
 * RecipeCreator page component for creating new recipes.
 * Integrates with Forkify API for recipe suggestions and uses React Hook Form for form management.
 */
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createRecipe } from '../redux/slices/recipesSlice';
import type { RootState } from '../redux/store';
import { toast } from 'react-toastify';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FaUtensils } from 'react-icons/fa';
import RecipeNameInput from '../components/recipecreator/RecipeNameInput';
import ImageUpload from '../components/recipecreator/ImageUpload';
import IngredientsInput from '../components/recipecreator/IngredientsInput';
import InstructionsInput from '../components/recipecreator/InstructionsInput';

/**
 * Form data interface for recipe creation.
 */
interface RecipeForm {
  name: string;
  instructions: string;
  thumbnail: File | null;
  ingredients: { value: string }[];
}

/**
 * Yup validation schema for recipe form.
 */
const schema = yup
  .object({
    name: yup.string().trim().required('Recipe name is required'),
    instructions: yup.string().trim().required('Instructions are required'),
    thumbnail: yup
      .mixed()
      .test('file', 'Recipe image is required', value => value instanceof File),
    ingredients: yup
      .array()
      .of(
        yup.object({
          value: yup.string().trim().required('Ingredient cannot be empty'),
        })
      )
      .min(1, 'At least one ingredient is required'),
  })
  .required();

/**
 * RecipeCreator page component.
 * @returns JSX.Element
 */
const RecipeCreator = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.recipes);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RecipeForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      instructions: '',
      thumbnail: null,
      ingredients: [{ value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setValue('name', watch('name'), { shouldValidate: true });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setValue, watch]);

  /**
   * Handle form submission to create a new recipe.
   * @param data - Form data containing recipe details.
   */
  const onSubmit = async (data: RecipeForm) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('instructions', data.instructions);
    formData.append(
      'ingredients',
      JSON.stringify(
        data.ingredients.map(ing => ing.value).filter(ing => ing.trim())
      )
    );
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    try {
      await dispatch(createRecipe(formData as unknown))?.unwrap();
      toast.success('Recipe created successfully!');
      setValue('name', '');
      setValue('instructions', '');
      setValue('thumbnail', null);
      setValue('ingredients', [{ value: '' }]);
    } catch (err) {
      toast.error(err || 'Failed to create recipe');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 pt-20">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4">
            <FaUtensils className="text-white text-2xl merriweather" />
          </div>
          <h1 className="text-4xl merriweather font-bold text-gray-800 mb-2">
            Create New Recipe
          </h1>
          <p className="text-gray-600">
            Share your culinary masterpiece with the world
          </p>
        </div>
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <RecipeNameInput
                register={register}
                setValue={setValue}
                watch={watch}
                errors={errors}
                suggestionsRef={suggestionsRef}
              />
              <ImageUpload setValue={setValue} watch={watch} errors={errors} />
            </div>
            <div className="space-y-6">
              <IngredientsInput
                fields={fields}
                append={append}
                remove={remove}
                register={register}
                errors={errors}
              />
            </div>
          </div>
          <InstructionsInput
            setValue={setValue}
            watch={watch}
            errors={errors}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Recipe...
                </div>
              ) : (
                <div className="flex items-center">
                  <FaUtensils className="mr-2" />
                  Create Recipe
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeCreator;
