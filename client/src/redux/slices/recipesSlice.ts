import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { recipesService } from "../../services/recipesService";

interface RecipesState {
  recipes: { id: number; name: string; postedBy: number }[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

export const createRecipe = createAsyncThunk(
  "recipes/createRecipe",
  async (formData: { name: string; instructions: string; ingredients: string[]; thumbnail?: File }, thunkAPI) => {
    // Debug logs for formData
    for (const [key, value] of formData.entries()) {
      if (key === "thumbnail" && value instanceof File) {
        console.log(`key: ${key}, value: File { name: ${value.name}, size: ${value.size} }`);
      } else {
        console.log(`key: ${key}, value:`, value);
      }
    }
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "thumbnail" && value instanceof File) {
        console.log(`key: ${key}, value: File { name: ${value.name}, size: ${value.size} }`);
      } else {
        console.log(`key: ${key}, value:`, value);
      }
    });
    const res = await recipesService.createRecipe(formData);
    return res.recipe; // Assuming res contains { recipe, message }
  }
);

export const getRecipes = createAsyncThunk(
  "recipes/getRecipes",
  async (params: { search?: string; page?: number; limit?: number } = {}, thunkAPI) => {
    const res = await recipesService.getRecipes(params.search, params.page, params.limit);
    return { recipes: res.recipes, total: res.total, page: res.page, limit: res.limit };
  }
);

export const getMyRecipes = createAsyncThunk(
  "recipes/getMyRecipes",
  async (params: { page?: number; limit?: number } = {}, thunkAPI) => {
    const res = await recipesService.getMyRecipes(params.page, params.limit);
    return { recipes: res.recipes, total: res.total, page: res.page, limit: res.limit };
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id: number, thunkAPI) => {
    await recipesService.deleteRecipe(id);
    return id; // Return ID to filter out the deleted recipe
  }
);

export const getRecipeById = createAsyncThunk(
  "recipes/getRecipeById",
  async (id: number, thunkAPI) => {
    const res = await recipesService.getRecipeById(id);
    return res.recipe; // Assuming res contains { success, recipe }
  }
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecipe.fulfilled, (state, action: PayloadAction<{ id: number; name: string; postedBy: number }>) => {
        state.loading = false;
        state.recipes.push(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create recipe";
      })
      .addCase(getRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecipes.fulfilled, (state, action: PayloadAction<{ recipes: { id: number; name: string; postedBy: number }[]; total: number; page: number; limit: number }>) => {
        state.loading = false;
        if (state.page !== action.payload.page && state.recipes.length > 0) {
          // Merge previous recipes with new ones (avoid duplicates by id)
          const existingIds = new Set(state.recipes.map(r => r.id));
          const merged = [...state.recipes];
          action.payload.recipes.forEach(recipe => {
            if (!existingIds.has(recipe.id)) {
              merged.push(recipe);
            }
          });
          state.recipes = merged;
        } else {
          // Replace recipes if same page or no previous recipes
          state.recipes = action.payload.recipes;
        }
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recipes";
      })
      .addCase(getMyRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyRecipes.fulfilled, (state, action: PayloadAction<{ recipes: { id: number; name: string; postedBy: number }[]; total: number; page: number; limit: number }>) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
      })
      .addCase(getMyRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch your recipes";
      })
      .addCase(deleteRecipe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.recipes = state.recipes.filter((recipe) => recipe.id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete recipe";
      })
      .addCase(getRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecipeById.fulfilled, (state, action: PayloadAction<{ id: number; name: string; postedBy: number }>) => {
        state.loading = false;
        // Optionally add or update the recipe in the state
        const index = state.recipes.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.recipes[index] = action.payload;
        } else {
          state.recipes.push(action.payload);
        }
      })
      .addCase(getRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch recipe";
      });
  },
});

export const { setPage, clearError } = recipesSlice.actions;
export default recipesSlice.reducer;