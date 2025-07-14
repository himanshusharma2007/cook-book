import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";
import { Op } from "sequelize";

@Injectable()
export class RecipesService {
  async createRecipe(createRecipeDto: Partial<Recipe>, userId: number): Promise<Recipe> {
    const { name, instructions, ingredients, thumbnail } = createRecipeDto;
    console.log('createRecipeDto', ingredients)
    if (!name || !instructions || !ingredients) {
      throw new UnauthorizedException("Name, instructions, and ingredients are required");
    }
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        throw new BadRequestException('Invalid ingredients format. Please provide a valid JSON array.');
      }
    }
    const recipe = await Recipe.create({
      name,
      instructions,
      ingredients: parsedIngredients,
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
      include: [User],
    });
    return { recipes: rows, total: count };
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await Recipe.findByPk(id, { include: [User] });
    if (!recipe) throw new NotFoundException("Recipe not found");
    return recipe;
  }

  async findById(id: number): Promise<Recipe | null> {
    return await Recipe.findOne({ where: { id } , include: [User] });
  }

  async deleteRecipe(id: number, userId: number): Promise<void> {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) throw new NotFoundException("Recipe not found");
    console.log('recipe.postedBy', recipe.dataValues.postedBy)
    console.log('userId', userId)
    if (recipe.dataValues.postedBy !== userId) throw new UnauthorizedException("You can only delete your own recipes");
    await recipe.destroy();
  }

  async findByUser(userId: number, page: number = 1, limit: number = 10): Promise<{ recipes: Recipe[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await Recipe.findAndCountAll({
      where: { postedBy: userId },
      offset,
      limit,
      order: [["postedAt", "DESC"]],
    });
    return { recipes: rows, total: count };
  }
}