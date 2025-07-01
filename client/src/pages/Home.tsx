import { useState, useEffect, useRef } from "react";
import { FaHeart, FaTrash, FaSearch, FaFilter, FaTimes, FaUser, FaGlobe } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" or "my"
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Current user (placeholder)
  const currentUser = "User1";

  // Enhanced placeholder recipe data
  const recipes = [
    {
      id: 1,
      name: "Spaghetti Carbonara",
      ingredients: ["Pasta", "Eggs", "Bacon", "Parmesan"],
      thumbnail: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
      postedBy: "User1",
      postedAt: new Date(Date.now() - 86400000).toISOString(),
      description: "Classic Italian pasta dish with eggs, cheese, and pancetta"
    },
    {
      id: 2,
      name: "Chicken Tikka Masala",
      ingredients: ["Chicken", "Tomatoes", "Cream", "Spices"],
      thumbnail: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300&h=200&fit=crop",
      postedBy: "User2",
      postedAt: new Date(Date.now() - 172800000).toISOString(),
      description: "Creamy and flavorful Indian curry dish"
    },
    {
      id: 3,
      name: "Caesar Salad",
      ingredients: ["Lettuce", "Croutons", "Parmesan", "Caesar Dressing"],
      thumbnail: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300&h=200&fit=crop",
      postedBy: "User1",
      postedAt: new Date(Date.now() - 259200000).toISOString(),
      description: "Fresh and crispy salad with homemade Caesar dressing"
    },
    {
      id: 4,
      name: "Beef Tacos",
      ingredients: ["Ground Beef", "Tortillas", "Cheese", "Lettuce"],
      thumbnail: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
      postedBy: "User3",
      postedAt: new Date(Date.now() - 345600000).toISOString(),
      description: "Delicious Mexican-style tacos with seasoned beef"
    }
  ];

  // Fetch suggestions from Forkify API
  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.status === 'success' && data.data.recipes) {
        // Limit to 6 suggestions and extract unique titles
        const uniqueSuggestions = data.data.recipes
          .slice(0, 6)
          .map(recipe => recipe.title)
          .filter((title, index, arr) => arr.indexOf(title) === index);
        
        setSuggestions(uniqueSuggestions);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounce suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle clicks outside suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target) && 
          searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleFavorite = (id) => {
    toast.success(`Added to favorites!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const handleDelete = (id) => {
    toast.error(`Recipe deleted!`, {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  // Filter recipes based on search and filter type
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "my" && recipe.postedBy === currentUser);
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Recipe Collection
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and share amazing recipes from around the world
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input with Suggestions */}
            <div className="relative flex-1 w-full lg:w-auto" ref={searchRef}>
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-gray-700 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
                {isLoadingSuggestions && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                  </div>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl z-50 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-b-0 text-gray-700"
                    >
                      <FaSearch className="inline mr-3 text-gray-400 text-xs" />
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeFilter === "all"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaGlobe className="text-sm" />
                All Posts
              </button>
              <button
                onClick={() => setActiveFilter("my")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeFilter === "my"
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <FaUser className="text-sm" />
                My Posts
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-600 text-sm">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              {activeFilter === "my" && " in your posts"}
            </p>
          </div>
        </div>

        {/* Recipe Grid */}
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all duration-300 group"
              >
                {/* Recipe Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={recipe.thumbnail}
                    alt={recipe.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recipe.postedBy === currentUser 
                        ? "bg-green-100 text-green-700" 
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {recipe.postedBy === currentUser ? "Your Recipe" : "Community"}
                    </span>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">
                    {recipe.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Ingredients */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-50 text-orange-700 text-xs rounded-lg"
                        >
                          {ingredient}
                        </span>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                          +{recipe.ingredients.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Recipe Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>By {recipe.postedBy}</span>
                    <span>{formatDate(recipe.postedAt)}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleFavorite(recipe.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 font-medium"
                    >
                      <FaHeart className="text-sm" />
                      Favorite
                    </button>
                    {recipe.postedBy === currentUser && (
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="flex items-center justify-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery ? 
                `No recipes match "${searchQuery}". Try a different search term.` :
                activeFilter === "my" ? 
                  "You haven't posted any recipes yet." :
                  "No recipes available."
              }
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors duration-200 font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;