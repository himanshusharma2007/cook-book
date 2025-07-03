import { useState } from "react";
import { FaImage, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createRecipe } from "../redux/slices/recipesSlice";
import type { RootState } from "../redux/store";
import { toast } from "react-toastify";
import QuillEditor from "../components/QuillEditor";

const RecipeCreator = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    instructions: "",
    thumbnail: null as File | null,
    ingredients: [""],
  });
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.recipes);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("instructions", recipe.instructions);
    formData.append("ingredients", JSON.stringify(recipe.ingredients));
    if (recipe.thumbnail) formData.append("thumbnail", recipe.thumbnail);

    try {
      await dispatch(createRecipe(formData as any)).unwrap(); // Type adjustment due to FormData
      toast.success("Recipe created successfully!");
      setRecipe({ name: "", instructions: "", thumbnail: null, ingredients: [""] });
    } catch (err) {
      toast.error(err || "Failed to create recipe");
    }
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Create Recipe</h1>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Recipe Name"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
          <QuillEditor
            value={recipe.instructions}
            onChange={(value) => setRecipe({ ...recipe, instructions: value })}
          />
          <div className="relative">
            <FaImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setRecipe({ ...recipe, thumbnail: e.target.files?.[0] || null })}
              className="w-full pl-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Ingredients</label>
            {recipe.ingredients.map((ing, index) => (
              <input
                key={index}
                type="text"
                placeholder={`Ingredient ${index + 1}`}
                value={ing}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    ingredients: recipe.ingredients.map((i, idx) =>
                      idx === index ? e.target.value : i
                    ),
                  })
                }
                className="w-full p-3 border border-gray-200 rounded-xl mb-2 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="flex items-center bg-yellow-500 text-white p-3 rounded-xl hover:bg-yellow-600 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Ingredient
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-600 text-white py-3 rounded-xl hover:bg-yellow-700 transition-colors disabled:bg-yellow-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Recipe"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeCreator;