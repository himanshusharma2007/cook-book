/**
 * RecipeNameInput component for entering recipe name with Forkify API suggestions.
 * Handles debounced search and suggestion selection.
 */
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FaSearch, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

interface ForkifyRecipe {
  publisher: string;
  title: string;
  source_url: string;
  recipe_id: string;
  image_url: string;
  social_rank: number;
  publisher_url: string;
}

interface ForkifyDetailResponse {
  recipe: ForkifyRecipe & { ingredients: string[] };
}

/**
 * Props for RecipeNameInput component.
 */
interface RecipeNameInputProps {
  register: ReturnType<typeof useFormContext>['register'];
  setValue: ReturnType<typeof useFormContext>['setValue'];
  watch: ReturnType<typeof useFormContext>['watch'];
  errors: ReturnType<typeof useFormContext>['formState']['errors'];
  suggestionsRef: React.RefObject<HTMLDivElement>;
}

/**
 * RecipeNameInput component.
 * @param props - Component props.
 * @returns JSX.Element
 */
const RecipeNameInput = ({
  register,
  setValue,
  watch,
  errors,
  suggestionsRef,
}: RecipeNameInputProps) => {
  const [recipeSuggestions, setRecipeSuggestions] = useState<ForkifyRecipe[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [fetchingRecipe, setFetchingRecipe] = useState(false);
  const name = watch('name');

  /**
   * Search Forkify API for recipe suggestions.
   * @param query - Search query for recipe name.
   */
  const searchRecipes = async (query: string) => {
    if (!query.trim()) {
      setRecipeSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setSearchLoading(true);
    try {
      // Fetch recipe suggestions from Forkify API
      const response = await axios.get<{
        count: number;
        recipes: ForkifyRecipe[];
      }>(
        `https://forkify-api.herokuapp.com/api/search?q=${encodeURIComponent(query)}`
      );
      if (response.data.count > 0) {
        setRecipeSuggestions(response.data.recipes.slice(0, 8));
        setShowSuggestions(true);
      } else {
        setRecipeSuggestions([]);
        setShowSuggestions(false);
      }
    } catch {
      setRecipeSuggestions([]);
      setShowSuggestions(false);
      //   toast.error('Failed to search recipes');
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * Handle recipe selection from Forkify API suggestions.
   * @param selectedRecipe - Selected recipe from suggestions.
   */
  const handleRecipeSelect = async (selectedRecipe: ForkifyRecipe) => {
    setFetchingRecipe(true);
    setShowSuggestions(false);
    try {
      // Fetch detailed recipe information from Forkify API
      const response = await axios.get<ForkifyDetailResponse>(
        `https://forkify-api.herokuapp.com/api/get?rId=${selectedRecipe.recipe_id}`
      );
      const detailedRecipe = response.data.recipe;
      const ingredientsList =
        detailedRecipe.ingredients && detailedRecipe.ingredients.length > 0
          ? detailedRecipe.ingredients.filter(ing => ing.trim() !== '')
          : [''];
      let thumbnailFile: File | null = null;
      if (detailedRecipe.image_url) {
        try {
          const safeUrl = detailedRecipe.image_url.startsWith('http://')
            ? detailedRecipe.image_url.replace('http://', 'https://')
            : detailedRecipe.image_url;
          const response = await fetch(safeUrl);
          const blob = await response.blob();
          thumbnailFile = new File(
            [blob],
            `${detailedRecipe.title.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`,
            { type: blob.type }
          );
        } catch {
          toast.warning(
            'Could not download recipe image, but other details were loaded'
          );
        }
      }
      const basicInstructions = `
        <h3>Recipe from ${detailedRecipe.publisher}</h3>
        <p><strong>Original Recipe:</strong> <a href="${detailedRecipe.source_url}" target="_blank" rel="noopener noreferrer">View full recipe instructions</a></p>
        <p><strong>Social Rank:</strong> ${detailedRecipe.social_rank}/100</p>
        <p><em>Please add your own detailed cooking instructions below...</em></p>
      `;
      setValue('name', detailedRecipe.title, { shouldValidate: true });
      setValue('instructions', basicInstructions, { shouldValidate: true });
      setValue('thumbnail', thumbnailFile, { shouldValidate: true });
      setValue(
        'ingredients',
        ingredientsList.map(value => ({ value })),
        { shouldValidate: true }
      );
      toast.success(
        `Recipe "${detailedRecipe.title}" loaded with ${ingredientsList.length} ingredients!`
      );
    } catch {
      toast.error('Failed to load recipe details');
    } finally {
      setFetchingRecipe(false);
    }
  };

  // Handle recipe name input with debounced search
  const handleNameChange = (value: string) => {
    setValue('name', value, { shouldValidate: true });
    const words = value.trim().split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord.length >= 3) {
      searchRecipes(lastWord);
    } else {
      setRecipeSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <label className="flex items-center text-lg merriweather font-semibold text-gray-700 mb-4">
        <FaSearch className="mr-2 text-orange-500" />
        Recipe Name
      </label>
      <div className="relative" ref={suggestionsRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Enter a recipe name (e.g., 'pizza', 'pasta')..."
            {...register('name')}
            onChange={e => handleNameChange(e.target.value)}
            className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-lg merriweather"
            disabled={fetchingRecipe}
          />
          {searchLoading && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
            </div>
          )}
          {!searchLoading && name && (
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          )}
        </div>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
        {showSuggestions && recipeSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
            {recipeSuggestions.map(suggestion => (
              <div
                key={suggestion.recipe_id}
                className="p-4 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200"
                onClick={() => handleRecipeSelect(suggestion)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={suggestion.image_url}
                    alt={suggestion.title}
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={e => {
                      e.currentTarget.src = '/api/placeholder/48/48';
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm">
                      {suggestion.title}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {suggestion.publisher}
                    </p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                        Rank: {suggestion.social_rank}
                      </span>
                    </div>
                  </div>
                  <FaExternalLinkAlt className="text-gray-400 text-sm" />
                </div>
              </div>
            ))}
          </div>
        )}
        {fetchingRecipe && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center text-orange-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
              <span className="text-sm">Loading recipe details...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeNameInput;
