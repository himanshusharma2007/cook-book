import { useState } from "react";
import { FaImage, FaPlus, FaTimes, FaUtensils, FaList, FaFileAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createRecipe } from "../redux/slices/recipesSlice";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";
import QuillEditor from "../components/QuillEditor";
import { BiUpload } from "react-icons/bi";

const RecipeCreator = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    instructions: "",
    thumbnail: null as File | null,
    ingredients: [""],
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.recipes);

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
    if (recipe.thumbnail) formData.append("thumbnail", recipe.thumbnail);
    

    try {
      await dispatch(createRecipe(formData as any)).unwrap();
      toast.success("Recipe created successfully!");
      setRecipe({ name: "", instructions: "", thumbnail: null, ingredients: [""] });
      setPreviewUrl(null);
    } catch (err) {
      toast.error(err || "Failed to create recipe");
    }
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const removeIngredient = (index: number) => {
    if (recipe.ingredients.length > 1) {
      setRecipe({
        ...recipe,
        ingredients: recipe.ingredients.filter((_, i) => i !== index),
      });
    }
  };

  const handleFileChange = (file: File | null) => {
    setRecipe({ ...recipe, thumbnail: file });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4">
            <FaUtensils className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Recipe</h1>
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
              {/* Recipe Name */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <FaFileAlt className="mr-2 text-orange-500" />
                  Recipe Name
                </label>
                <input
                  type="text"
                  placeholder="Enter a delicious recipe name..."
                  value={recipe.name}
                  onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-lg"
                />
              </div>

              {/* Ingredients */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <FaList className="mr-2 text-orange-500" />
                  Ingredients
                </label>
                <div className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-600 font-medium text-sm">{index + 1}</span>
                      </div>
                      <input
                        type="text"
                        placeholder={`Ingredient ${index + 1}`}
                        value={ingredient}
                        onChange={(e) =>
                          setRecipe({
                            ...recipe,
                            ingredients: recipe.ingredients.map((ing, idx) =>
                              idx === index ? e.target.value : ing
                            ),
                          })
                        }
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

            {/* Right Column */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <FaImage className="mr-2 text-orange-500" />
                  Recipe Image
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
                      <BiUpload className="text-4xl text-gray-400 mb-4 mx-auto" />
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
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
              <FaFileAlt className="mr-2 text-orange-500" />
              Instructions
            </label>
            <div className="min-h-[300px]">
              <QuillEditor
                value={recipe.instructions}
                onChange={(value) => setRecipe({ ...recipe, instructions: value })}
              />
            </div>
          </div>

          {/* Submit Button */}
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