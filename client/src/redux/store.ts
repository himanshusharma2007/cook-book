import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import recipesReducer from "./slices/recipesSlice";
import favoritesReducer from "./slices/favoritesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    recipes: recipesReducer,
    favorites: favoritesReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;