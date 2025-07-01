import { useState } from "react";
import { FaHeart, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Placeholder recipe data (to be replaced with backend API)
  const recipes = [
    {
      id: 1,
      name: "Spaghetti Carbonara",
      ingredients: ["Pasta", "Eggs", "Bacon"],
      thumbnail: "https://via.placeholder.com/150",
      postedBy: "User1",
      postedAt: new Date().toISOString(),
    },
  ];

  const handleFavorite = (id: number) => {
    toast.info(`Added recipe ${id} to favorites!`);
    // Placeholder for favorite logic
  };

  const handleDelete = (id: number) => {
    toast.error(`Deleted recipe ${id}!`);
    // Placeholder for delete logic
  };

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Recipes</h1>
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="border p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={recipe.thumbnail}
              alt={recipe.name}
              className="w-full h-32 object-cover mb-2"
            />
            <h2 className="text-xl font-medium">{recipe.name}</h2>
            <p className="text-gray-600">By: {recipe.postedBy}</p>
            <div className="flex space-x-4 mt-2">
              <FaHeart
                className="cursor-pointer text-red-500"
                onClick={() => handleFavorite(recipe.id)}
              />
              <FaTrash
                className="cursor-pointer text-red-500"
                onClick={() => handleDelete(recipe.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;