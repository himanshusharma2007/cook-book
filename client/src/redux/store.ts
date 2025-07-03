import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import recipesReducer from "../redux/slices/recipesSlice";
import favoritesReducer from "../redux/slices/favoritesSlice";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    favorites: favoritesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable actions if needed (e.g., for File objects in FormData)
        ignoredActions: ["recipes/createRecipe/fulfilled"],
        ignoredPaths: ["recipes.loading"], // Ignore loading state if it causes issues
      },
    }),
});

// Infer the types for the RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;