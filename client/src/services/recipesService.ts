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
