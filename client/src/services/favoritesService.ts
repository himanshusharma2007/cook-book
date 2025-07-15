import { RecipeResponse } from 'types';
import api from './api';

// Types
interface FavoritesResponse {
  recipes: { id: number; name: string; thumbnail: string; postedBy: number }[];
}

export const favoritesService = {
  /**
   * Adds a recipe to favorites.
   * @param recipeId - The ID of the recipe to favorite.
   * @returns Promise<{ message: string; favoriteId: number }>
   */
  addFavorite: async (
    recipeId: number
  ): Promise<{ message: string; favoriteId: number }> => {
    try {
      const response = await api.post(`/favorites/${recipeId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to add favorite'
      );
    }
  },

  /**
   * Fetches user's favorite recipes.
   * @returns Promise<FavoritesResponse>
   */
  getFavorites: async (): Promise<RecipeResponse[]> => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch favorites'
      );
    }
  },

  /**
   * Removes a recipe from favorites.
   * @param recipeId - The ID of the recipe to remove.
   * @returns Promise<{ message: string }>
   */
  removeFavorite: async (recipeId: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/favorites/${recipeId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to remove favorite'
      );
    }
  },
};
