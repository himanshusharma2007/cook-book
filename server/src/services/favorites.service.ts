import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Favorite } from "../models/favorite.model";
import { Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";

@Injectable()
export class FavoritesService {
  async addFavorite(recipeId: number, userId: number): Promise<Favorite> {
    const recipe = await Recipe.findByPk(recipeId);
    if (!recipe) throw new NotFoundException("Recipe not found");

    const existingFavorite = await Favorite.findOne({ where: { userId, recipeId } });
    if (existingFavorite) throw new UnauthorizedException("Recipe already in favorites");

    const favorite = await Favorite.create({ userId, recipeId });
    return favorite;
  }

  async findAll(userId: number): Promise<Recipe[]> {
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{ model: Recipe, include: [User] }],
    });
    return favorites.map((favorite) => favorite.recipe);
  }

  async removeFavorite(recipeId: number, userId: number): Promise<void> {
    const favorite = await Favorite.findOne({ where: { userId, recipeId } });
    if (!favorite) throw new NotFoundException("Favorite not found");
    await favorite.destroy();
  }
}