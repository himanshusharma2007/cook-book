import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Favorite } from './entities/favorite.model';
import { Recipe } from '../recipes/entities/recipe.model';

@Injectable()
export class FavoritesService {
  async addFavorite(recipeId: number, userId: number): Promise<Favorite> {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) throw new NotFoundException('Recipe not found');

    const existingFavorite = await Favorite.findOne({
      where: { userId, recipeId },
    });
    if (existingFavorite)
      throw new UnauthorizedException('Recipe already in favorites');

    const favorite = await Favorite.create({ userId, recipeId });
    return favorite;
  }

  async findAll(userId: number): Promise<Recipe[]> {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [Recipe],
    });

    const recipes = favorites
      .map((favorite) => {
        // Access the recipe from dataValues if the direct property doesn't work
        const recipe = favorite?.recipe || favorite?.dataValues?.recipe;
        console.log('Recipe from dataValues:', recipe);
        return recipe;
      })
      .filter((recipe) => recipe !== null);

    return recipes;
  }
  async removeFavorite(recipeId: number, userId: number): Promise<void> {
    const favorite = await Favorite.findOne({ where: { userId, recipeId } });
    if (!favorite) throw new NotFoundException('Favorite not found');
    await favorite.destroy();
  }

  async removeAllFavoritesForRecipe(recipeId: number): Promise<void> {
    await Favorite.destroy({ where: { recipeId } });
  }
}
