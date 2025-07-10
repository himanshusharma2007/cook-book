import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Favorite } from './entities/favorite.model';
import { Recipe } from '../recipes/entities/recipe.model';

@Injectable()
export class FavoritesService {
  /**
   * Adds a recipe to user's favorites.
   * @param recipeId - Recipe ID.
   * @param userId - User ID.
   * @returns Created favorite object.
   * @throws NotFoundException if recipe not found.
   * @throws UnauthorizedException if already favorited.
   */
  async addFavorite(recipeId: number, userId: number): Promise<Favorite> {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) throw new NotFoundException('Recipe not found');

    const existingFavorite = await Favorite.findOne({
      where: { userId, recipeId },
    });
    if (existingFavorite) throw new UnauthorizedException('Recipe already in favorites');

    const favorite = await Favorite.create({ userId, recipeId });
    return favorite;
  }

  /**
   * Fetches all favorite recipes for a user.
   * @param userId - User ID.
   * @returns List of favorite recipes.
   */
  async findAll(userId: number): Promise<Recipe[]> {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [Recipe],
    });

    const recipes = favorites
      .map((favorite) => {
        const recipe = favorite?.recipe || favorite?.dataValues?.recipe;
        console.log('Recipe from dataValues:', recipe);
        return recipe;
      })
      .filter((recipe) => recipe !== null);

    return recipes;
  }

  /**
   * Removes a recipe from user's favorites.
   * @param recipeId - Recipe ID.
   * @param userId - User ID.
   * @throws NotFoundException if favorite not found.
   */
  async removeFavorite(recipeId: number, userId: number): Promise<void> {
    const favorite = await Favorite.findOne({ where: { userId, recipeId } });
    if (!favorite) throw new NotFoundException('Favorite not found');
    await favorite.destroy();
  }

  /**
   * Removes all favorites for a recipe.
   * @param recipeId - Recipe ID.
   */
  async removeAllFavoritesForRecipe(recipeId: number): Promise<void> {
    await Favorite.destroy({ where: { recipeId } });
  }
}
