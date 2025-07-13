import api from './api';

// Types
interface FavoritesResponse {
  recipes: { id: number; name: string; thumbnail: string; postedBy: number }[];
}

export const favoritesService = {
  addFavorite: async (
    recipeId: number
  ): Promise<{ message: string; favoriteId: number }> => {
    try {
      const response = await api.post(`/favorites/${recipeId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to add favorite'
      );
    }
  },

  getFavorites: async (): Promise<FavoritesResponse> => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch favorites'
      );
    }
  },

  removeFavorite: async (recipeId: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/favorites/${recipeId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to remove favorite'
      );
    }
  },
};
