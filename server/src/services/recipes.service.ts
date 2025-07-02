import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";
import { Op } from "sequelize";

@Injectable()
export class RecipesService {
  async createRecipe(createRecipeDto: Partial<Recipe>, userId: number): Promise<Recipe> {
    const { name, instructions, ingredients, thumbnail } = createRecipeDto;
    if (!name || !instructions || !ingredients) {
      throw new UnauthorizedException("Name, instructions, and ingredients are required");
    }

    const recipe = await Recipe.create({
      name,
      instructions,
      ingredients,
      thumbnail,
      postedBy: userId,
    });
    return recipe;
  }

  async findAll(search?: string, page: number = 1, limit: number = 10): Promise<{ recipes: Recipe[]; total: number }> {
    const offset = (page - 1) * limit;
    const where = search ? { name: { [Op.iLike]: `%${search}%` } } : {};
    const { count, rows } = await Recipe.findAndCountAll({
      where,
      offset,
      limit,
      order: [["postedAt", "DESC"]],
    });
    return { recipes: rows, total: count };
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await Recipe.findByPk(id, { include: [User] });
    if (!recipe) throw new NotFoundException("Recipe not found");
    return recipe;
  }

  async deleteRecipe(id: number, userId: number): Promise<void> {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) throw new NotFoundException("Recipe not found");
    if (recipe.postedBy !== userId) throw new UnauthorizedException("You can only delete your own recipes");
    await recipe.destroy();
  }
}