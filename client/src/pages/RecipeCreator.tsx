import { useState } from "react";
import { FaImage, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuillEditorComponent from "../components/QuillEditor";

const RecipeCreator = () => {
  const [recipe, setRecipe] = useState({
    name: "",
    instructions: "",
    thumbnail: "",
    ingredients: [""],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for backend submit API
    toast.success("Recipe created successfully!");
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Create Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Recipe Name"
          value={recipe.name}
          onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <QuillEditorComponent
          content={recipe.instructions}
          onChange={(value) => setRecipe({ ...recipe, instructions: value })}
          placeholder="Enter recipe instructions..."
          height="400px"
        />
        <div className="flex items-center border rounded p-2">
          <FaImage className="mr-2" />
          <input
            type="text"
            placeholder="Thumbnail URL"
            value={recipe.thumbnail}
            onChange={(e) => setRecipe({ ...recipe, thumbnail: e.target.value })}
            className="w-full outline-none"
          />
        </div>
        <div>
          <label className="block mb-2">Ingredients</label>
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
              className="w-full p-2 border rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            <FaPlus className="mr-2" /> Add Ingredient
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Recipe
        </button>
      </form>
    </div>
  );
};

export default RecipeCreator;