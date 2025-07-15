import api from './api';
import { RecipeResponse, RecipeDetails } from 'types';

export const recipesService = {
  /**
   * Creates a new recipe.
   * @param data - Recipe data in FormData format.
   * @returns Promise<RecipeResponse>
   */
  createRecipe: async (data: FormData): Promise<RecipeResponse> => {
    try {
      const response = await api.post('/recipes', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to create recipe'
      );
    }
  },

  /**
   * Fetches recipes with optional search and pagination.
   * @param search - Optional search term.
   * @param page - Optional page number.
   * @param limit - Optional limit per page.
   * @returns Promise containing recipes and pagination info.
   */
  getRecipes: async (
    search?: string,
    page?: number,
    limit?: number
  ): Promise<{
    recipes: RecipeResponse[];
    total: number;
    page: number;
    limit: number;
  }> => {
    try {
      const response = await api.get('/recipes', {
        params: { search, page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch recipes'
      );
    }
  },

  /**
   * Fetches the current user's recipes with pagination.
   * @param page - Optional page number.
   * @param limit - Optional limit per page.
   * @returns Promise containing recipes and pagination info.
   */
  getMyRecipes: async (
    page?: number,
    limit?: number
  ): Promise<{
    recipes: RecipeResponse[];
    total: number;
    page: number;
    limit: number;
  }> => {
    try {
      const response = await api.get('/recipes/my', {
        params: { page, limit },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch your recipes'
      );
    }
  },

  /**
   * Deletes a recipe by ID.
   * @param id - Recipe ID.
   * @returns Promise<void>
   */
  deleteRecipe: async (id: number): Promise<void> => {
    try {
      await api.delete(`/recipes/${id}`);
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to delete recipe'
      );
    }
  },

  /**
   * Fetches a recipe by ID.
   * @param id - Recipe ID.
   * @returns Promise<RecipeDetails>
   */
  getRecipeById: async (id: number): Promise<RecipeDetails> => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch recipe'
      );
    }
  },
};
