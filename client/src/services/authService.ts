import api from './api';

// Types
interface RecipeData {
  name: string;
  instructions: string;
  ingredients: string[];
  thumbnail?: string | File;
}

interface RecipeResponse {
  recipe: { id: number; name: string; postedBy: number };
  message: string;
}

interface RecipesResponse {
  recipes: RecipeResponse[];
  total: number;
  page: number;
  limit: number;
}

export const recipesService = {
  /**
   * Creates a new recipe.
   * @param data - Recipe data including name, instructions, ingredients, and optional thumbnail.
   * @returns Promise<RecipeResponse>
   */
  createRecipe: async (data: RecipeData): Promise<RecipeResponse> => {
    try {
      const response = await api.post('/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to create recipe'
      );
    }
  },

  /**
   * Fetches recipes with optional search and pagination.
   * @param search - Optional search query.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of recipes per page (default: 10).
   * @returns Promise<RecipesResponse>
   */
  getRecipes: async (
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<RecipesResponse> => {
    try {
      const params = { search, page, limit };
      const response = await api.get('/recipes', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch recipes'
      );
    }
  },

  /**
   * Fetches user's own recipes with pagination.
   * @param page - Page number for pagination (default: 1).
   * @param limit - Number of recipes per page (default: 10).
   * @returns Promise<RecipesResponse>
   */
  getMyRecipes: async (
    page: number = 1,
    limit: number = 10
  ): Promise<RecipesResponse> => {
    try {
      const params = { page, limit };
      const response = await api.get('/recipes/mine', { params });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch your recipes'
      );
    }
  },

  /**
   * Deletes a recipe by ID.
   * @param id - The ID of the recipe to delete.
   * @returns Promise<{ message: string }>
   */
  deleteRecipe: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await api.delete(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete recipe'
      );
    }
  },

  /**
   * Fetches a recipe by ID.
   * @param id - The ID of the recipe to fetch.
   * @returns Promise<{ recipe: { id: number; name: string; postedBy: number } }>
   */
  getRecipeById: async (
    id: number
  ): Promise<{ recipe: { id: number; name: string; postedBy: number } }> => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch recipe'
      );
    }
  },
};
