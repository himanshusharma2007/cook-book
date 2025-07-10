import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Recipe } from './entities/recipe.model';
import { User } from '../user/entities/user.model';
import { Op } from 'sequelize';
import { CreateRecipeDto } from './dto/create-recipe.dto';

@Injectable()
export class RecipesService {
  /**
   * Creates a new recipe for a user.
   * @param createRecipeDto - Recipe details.
   * @param userId - User ID.
   * @returns Created recipe.
   * @throws UnauthorizedException if required fields missing.
   * @throws BadRequestException if ingredients format invalid.
   */
  async createRecipe(createRecipeDto: CreateRecipeDto, userId: number): Promise<Recipe> {
    const { name, instructions, ingredients, thumbnail } = createRecipeDto;
    if (!name || !instructions || !ingredients) {
      throw new UnauthorizedException('Name, instructions, and ingredients are required');
    }
    let parsedIngredients = ingredients;
    if (typeof ingredients === 'string') {
      try {
        parsedIngredients = JSON.parse(ingredients);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        throw new BadRequestException(
          'Invalid ingredients format. Please provide a valid JSON array.'
        );
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

  /**
   * Fetches recipes with optional search and pagination.
   * @param search - Optional search query.
   * @param page - Page number (default: 1).
   * @param limit - Items per page (default: 10).
   * @returns Recipes and total count.
   */
  async findAll(
    search?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ recipes: Recipe[]; total: number }> {
    const offset = (page - 1) * limit;
    const where = search ? { name: { [Op.iLike]: `%${search}%` } } : {};
    const { count, rows } = await Recipe.findAndCountAll({
      where,
      offset,
      limit,
      order: [['postedAt', 'DESC']],
      include: [User],
    });
    return { recipes: rows, total: count };
  }

  /**
   * Fetches a recipe by ID.
   * @param id - Recipe ID.
   * @returns Recipe or null.
   */
  async findById(id: number): Promise<Recipe | null> {
    return await Recipe.findOne({ where: { id }, include: [User] });
  }

  /**
   * Deletes a recipe if owned by the user.
   * @param id - Recipe ID.
   * @param userId - User ID.
   * @throws NotFoundException if recipe not found.
   * @throws UnauthorizedException if not user's recipe.
   */
  async deleteRecipe(id: number, userId: number): Promise<void> {
    const recipe = await Recipe.findByPk(id);
    if (!recipe) throw new NotFoundException('Recipe not found');
    if (recipe.dataValues.postedBy !== userId)
      throw new UnauthorizedException('You can only delete your own recipes');
    await recipe.destroy();
  }

  /**
   * Fetches user's recipes with pagination.
   * @param userId - User ID.
   * @param page - Page number (default: 1).
   * @param limit - Items per page (default: 10).
   * @returns User's recipes and total count.
   */
  async findByUser(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<{ recipes: Recipe[]; total: number }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await Recipe.findAndCountAll({
      where: { postedBy: userId },
      offset,
      limit,
      order: [['postedAt', 'DESC']],
    });
    return { recipes: rows, total: count };
  }
}
