import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { favoritesService } from "../../services/favoritesService";

interface FavoritesState {
  recipes: { id: number; name: string; thumbnail: string; postedBy: number }[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  recipes: [],
  loading: false,
  error: null,
};

export const addFavorite = createAsyncThunk(
  "favorites/addFavorite",
  async (recipeId: number, thunkAPI) => {
    const res = await favoritesService.addFavorite(recipeId);
    return { id: recipeId, message: res.message }; // Return recipeId for state update
  }
);

export const getFavorites = createAsyncThunk(
  "favorites/getFavorites",
  async (_, thunkAPI) => {
    const res = await favoritesService.getFavorites();
    return res.recipes;
  }
);

export const removeFavorite = createAsyncThunk(
  "favorites/removeFavorite",
  async (recipeId: number, thunkAPI) => {
    await favoritesService.removeFavorite(recipeId);
    return recipeId; // Return ID to filter out the removed favorite
  }
);

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action: PayloadAction<{ id: number; message: string }>) => {
        state.loading = false;
        // Optionally fetch updated favorites if needed
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add favorite";
      })
      .addCase(getFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFavorites.fulfilled, (state, action: PayloadAction<{ id: number; name: string; thumbnail: string; postedBy: number }[]>) => {
        state.loading = false;
        state.recipes = action.payload;
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch favorites";
      })
      .addCase(removeFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.recipes = state.recipes.filter((recipe) => recipe.id !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to remove favorite";
      });
  },
});

export const { clearError } = favoritesSlice.actions;
export default favoritesSlice.reducer;