import { FaHeart, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Favorites = () => {
  // Placeholder favorite recipes data
  const favorites = [
    {
      id: 1,
      name: "Spaghetti Carbonara",
      thumbnail: "https://via.placeholder.com/150",
      postedBy: "User1",
    },
  ];

  const handleUnfavorite = (id: number) => {
    toast.info(`Removed recipe ${id} from favorites!`);
    // Placeholder for unfavorite logic
  };

  const handleDelete = (id: number) => {
    toast.error(`Deleted recipe ${id} from favorites!`);
    // Placeholder for delete logic
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Favorites</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favorites.map((recipe) => (
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
                onClick={() => handleUnfavorite(recipe.id)}
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

export default Favorites;