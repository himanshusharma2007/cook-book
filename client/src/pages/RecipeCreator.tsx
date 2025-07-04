import { useState, useEffect, useRef } from "react";
import { FaImage, FaPlus, FaTimes, FaUtensils, FaList, FaFileAlt, FaSearch, FaExternalLinkAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createRecipe } from "../redux/slices/recipesSlice";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";
import QuillEditor from "../components/QuillEditor";
import { BiUpload } from "react-icons/bi";
import axios from "axios";

// Forkify API types
interface ForkifyRecipe {
  publisher: string;
  title: string;
  source_url: string;
  recipe_id: string;
  image_url: string;
  social_rank: number;
  publisher_url: string;
}

interface ForkifySearchResponse {
  count: number;
  recipes: ForkifyRecipe[];
}

interface ForkifyDetailResponse {
  recipe: ForkifyRecipe & {
    ingredients: string[];
  };
}

const RecipeCreator = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    instructions: "",
    thumbnail: null as File | null,
    ingredients: [""],
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isImageFromAPI, setIsImageFromAPI] = useState(false);

  // Forkify API states
  const [recipeSuggestions, setRecipeSuggestions] = useState<ForkifyRecipe[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [fetchingRecipe, setFetchingRecipe] = useState(false);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.recipes);

  // Debounced search function
  const searchRecipes = async (query: string) => {
    if (!query.trim()) {
      setRecipeSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await axios.get<ForkifySearchResponse>(
        `https://forkify-api.herokuapp.com/api/search?q=${encodeURIComponent(query)}`
      );

      if (response.data.count > 0) {
        setRecipeSuggestions(response.data.recipes.slice(0, 8)); // Limit to 8 suggestions
        setShowSuggestions(true);
      } else {
        setRecipeSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      setRecipeSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle recipe name input with debounced search
  const handleNameChange = (value: string) => {
    setRecipe(prev => ({ ...prev, name: value }));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      const words = value.trim().split(/\s+/);
      const lastWord = words[words.length - 1];

      // Only search if we have a complete word (ends with space or has significant length)
      if (lastWord.length >= 3) {
        searchRecipes(lastWord);
      }
    }, 300);
  };

  // Utility function to convert image URL to File object
  const urlToFile = async (imageUrl: string, filename: string = 'image.jpg'): Promise<File> => {
    // Upgrade http to https if needed
    const safeUrl = imageUrl.startsWith('http://')
      ? imageUrl.replace('http://', 'https://')
      : imageUrl;

    const response = await fetch(safeUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };


  // Handle recipe selection from suggestions
  const handleRecipeSelect = async (selectedRecipe: ForkifyRecipe) => {
    setFetchingRecipe(true);
    setShowSuggestions(false);
    setSelectedRecipeId(selectedRecipe.recipe_id);

    try {
      // Fetch detailed recipe information
      const response = await axios.get<ForkifyDetailResponse>(
        `https://forkify-api.herokuapp.com/api/get?rId=${selectedRecipe.recipe_id}`
      );

      const detailedRecipe = response.data.recipe;
      console.log("Forkify API Response:", detailedRecipe);
      console.log("Ingredients from API:", detailedRecipe.ingredients);

      // Prepare ingredients array - make sure we have the ingredients from the API
      const ingredientsList = detailedRecipe.ingredients && detailedRecipe.ingredients.length > 0
        ? detailedRecipe.ingredients.filter(ing => ing.trim() !== "")
        : [""];

      console.log("Filtered ingredients:", ingredientsList);

      // Convert image URL to File object
      let thumbnailFile: File | null = null;
      let imageUrl: string | null = null;

      if (detailedRecipe.image_url) {
        try {
          const cleanFilename = detailedRecipe.title.replace(/[^a-zA-Z0-9]/g, '_') + '.jpg';
          thumbnailFile = await urlToFile(detailedRecipe.image_url, cleanFilename);
          console.log('thumbnailFile created:', thumbnailFile);

          // Create preview URL
          imageUrl = URL.createObjectURL(thumbnailFile);
        } catch (imageError) {
          console.error("Error downloading image:", imageError);
          toast.warning("Could not download recipe image, but other details were loaded");
        }
      }

      // Generate basic instructions from the recipe source
      const basicInstructions = `
        <h3>Recipe from ${detailedRecipe.publisher}</h3>
        <p><strong>Original Recipe:</strong> <a href="${detailedRecipe.source_url}" target="_blank" rel="noopener noreferrer">View full recipe instructions</a></p>
        <p><strong>Social Rank:</strong> ${detailedRecipe.social_rank}/100</p>
        <p><em>Please add your own detailed cooking instructions below...</em></p>
      `;

      // Update all states at once to prevent race conditions
      setRecipe(prev => ({
        ...prev,
        name: detailedRecipe.title,
        instructions: basicInstructions,
        thumbnail: thumbnailFile,
        ingredients: ingredientsList
      }));

      if (imageUrl) {
        setPreviewUrl(imageUrl);
        setIsImageFromAPI(true);
      }

      toast.success(`Recipe "${detailedRecipe.title}" loaded with ${ingredientsList.length} ingredients!`);

    } catch (error) {
      console.error("Error fetching recipe details:", error);
      toast.error("Failed to load recipe details");
    } finally {
      setFetchingRecipe(false);
    }
  };

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!recipe.name.trim()) {
      toast.error("Recipe name is required");
      return;
    }
    if (!recipe.instructions.trim()) {
      toast.error("Instructions are required");
      return;
    }
    if (recipe.ingredients.every(ing => !ing.trim())) {
      toast.error("At least one ingredient is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("instructions", recipe.instructions);
    formData.append("ingredients", JSON.stringify(recipe.ingredients.filter(ing => ing.trim())));

    console.log('Submitting recipe.thumbnail:', recipe.thumbnail);

    // Ensure we have a valid File object for the thumbnail
    if (recipe.thumbnail) {
      formData.append("thumbnail", recipe.thumbnail);
    }

    try {
      await dispatch(createRecipe(formData as any)).unwrap();
      toast.success("Recipe created successfully!");
      setRecipe({ name: "", instructions: "", thumbnail: null, ingredients: [""] });
      setPreviewUrl(null);
      setSelectedRecipeId(null);
      setIsImageFromAPI(false);
    } catch (err) {
      toast.error(err || "Failed to create recipe");
    }
  };

  const addIngredient = () => {
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      setRecipe(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setRecipe(prev => ({ ...prev, thumbnail: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsImageFromAPI(false); // This is a manually uploaded file
    } else {
      setPreviewUrl(null);
      setIsImageFromAPI(false);
    }
    // Clear selected recipe ID when manually uploading
    setSelectedRecipeId(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files[0] && files[0].type.startsWith('image/')) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleIngredientChange = (index: number, value: string) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, idx) =>
        idx === index ? value : ing
      ),
    }));
  };

  const handleInstructionsChange = (value: string) => {
    setRecipe(prev => ({ ...prev, instructions: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 pt-20">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4">
            <FaUtensils className="text-white  text-2xl merriweather" />
          </div>
          <h1 className=" text-4xl merriweather font-bold text-gray-800 mb-2">Create New Recipe</h1>
          <p className="text-gray-600">Share your culinary masterpiece with the world</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-center font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Recipe Name with Suggestions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className="flex items-center  text-lg merriweather font-semibold text-gray-700 mb-4">
                  <FaFileAlt className="mr-2 text-orange-500" />
                  Recipe Name
                </label>
                <div className="relative" ref={suggestionsRef}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter a recipe name (e.g., 'pizza', 'pasta')..."
                      value={recipe.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full p-4 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200  text-lg merriweather"
                      disabled={fetchingRecipe}
                    />
                    {searchLoading && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                      </div>
                    )}
                    {!searchLoading && recipe.name && (
                      <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    )}
                  </div>

                  {/* Recipe Suggestions Dropdown */}
                  {showSuggestions && recipeSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-80 overflow-y-auto">
                      {recipeSuggestions.map((suggestion, index) => (
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
                              onError={(e) => {
                                e.currentTarget.src = '/api/placeholder/48/48';
                              }}
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-800 text-sm">{suggestion.title}</h4>
                              <p className="text-xs text-gray-500">{suggestion.publisher}</p>
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
                </div>

                {/* Loading indicator for recipe fetching */}
                {fetchingRecipe && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center text-orange-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mr-2"></div>
                      <span className="text-sm">Loading recipe details...</span>
                    </div>
                  </div>
                )}
              </div>
              {/* Image Upload */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className="flex items-center  text-lg merriweather font-semibold text-gray-700 mb-4">
                  <FaImage className="mr-2 text-orange-500" />
                  Recipe Image
                  {selectedRecipeId && isImageFromAPI && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                      From API
                    </span>
                  )}
                  {selectedRecipeId && !isImageFromAPI && recipe.thumbnail && (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      Auto-filled
                    </span>
                  )}
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragOver
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                    }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Recipe preview"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => handleFileChange(null)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                      >
                        <FaTimes className="text-white text-sm" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <BiUpload className=" text-4xl merriweather text-gray-400 mb-4 mx-auto" />
                      <p className="text-gray-600 mb-2">Drop your image here or click to browse</p>
                      <p className="text-gray-400 text-sm">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Ingredients */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className="flex items-center  text-lg merriweather font-semibold text-gray-700 mb-4">
                  <FaList className="mr-2 text-orange-500" />
                  Ingredients
                  {selectedRecipeId && (
                    <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                      Auto-filled
                    </span>
                  )}
                </label>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <input
                        type="text"
                        placeholder={`Ingredient ${index + 1}`}
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                      />
                      {recipe.ingredients.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeIngredient(index)}
                          className="flex-shrink-0 w-8 h-8 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200"
                        >
                          <FaTimes className="text-red-600 text-sm" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="flex items-center justify-center w-full p-3 border-2 border-dashed border-orange-300 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 text-orange-600 font-medium"
                  >
                    <FaPlus className="mr-2" />
                    Add Ingredient
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="flex items-center  text-lg merriweather font-semibold text-gray-700 mb-4">
              <FaFileAlt className="mr-2 text-orange-500" />
              Instructions
              {selectedRecipeId && (
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                  Template added
                </span>
              )}
            </label>
            <div className="min-h-[300px]">
              <QuillEditor
                value={recipe.instructions}
                onChange={handleInstructionsChange}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading || fetchingRecipe}
              className="px-12 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-amber-600 focus:ring-4 focus:ring-orange-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Recipe...
                </div>
              ) : fetchingRecipe ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading Recipe...
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