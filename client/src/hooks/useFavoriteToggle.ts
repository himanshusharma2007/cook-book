/**
 * Custom hook to handle toggling favorite status for a recipe.
 * @param recipeId - The ID of the recipe to toggle.
 * @returns An object with isFavorite status and toggleFavorite function.
 */
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from '../redux/slices/favoritesSlice';
import type { RootState } from '../redux/store';
import { AppDispatch } from '../redux/store';

export const useFavoriteToggle = (recipeId: number) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, favorites } = useSelector((state: RootState) => ({
    user: state.auth.user,
    favorites: state.favorites.recipes,
  }));
  const isFavorite = favorites?.some(fav => fav.id === recipeId);

  /**
   * Toggle favorite status for the recipe.
   */
  const toggleFavorite = async () => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }
    try {
      if (isFavorite) {
        await dispatch(removeFavorite(recipeId)).unwrap();
        toast.success('Removed from favorites');
      } else {
        await dispatch(addFavorite(recipeId)).unwrap();
        toast.success('Added to favorites');
      }
      await dispatch(getFavorites()).unwrap();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update favorites');
    }
  };

  return { isFavorite, toggleFavorite };
};
