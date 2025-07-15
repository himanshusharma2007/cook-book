export interface Recipe {
  id: number;
  name: string;
  thumbnail: string | null;
  instructions?: string;
  ingredients?: string[];
  postedBy: number;
  user?: { name: string };
}

export interface RecipeDetails {
  id: number;
  name: string;
  thumbnail: string | null;
  instructions: string;
  ingredients: string[];
  postedBy: number;
  postedAt: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: number; name: string };
}

export interface RecipeData {
  name: string;
  instructions: string;
  ingredients: string[];
  thumbnail?: File;
}

export interface RecipeResponse {
  id: number;
  name: string;
  instructions?: string;
  ingredients?: string[];
  thumbnail: string | null;
  postedBy: number;
}

export interface RecipeForm {
  name: string;
  instructions: string;
  thumbnail: File | null;
  ingredients: { value: string }[];
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: { id: number; name: string; email: string };
  message: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
}

export interface RecipesState {
  recipes: RecipeResponse[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
}

export interface FavoritesResponse {
  recipes: RecipeResponse[];
}
