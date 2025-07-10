import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  Res,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryUtils } from '../../utils/cloudinary.utils';
import { FavoritesService } from '../favorites/favorites.service';
import { setResponseMeta } from 'src/utils/response.utils';
import { LogExecution } from 'src/common/decorators/log.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(
    private recipesService: RecipesService,
    private cloudinaryUtils: CloudinaryUtils,
    private favoritesService: FavoritesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      storage: new CloudinaryUtils().getStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @LogExecution()
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRecipeDto: CreateRecipeDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipeDto = {
        ...createRecipeDto,
        thumbnail: file?.path ?? undefined,
      };

      const recipe = await this.recipesService.createRecipe(recipeDto, req.user.id);

      setResponseMeta(res, 'recipe', 'Recipe created successfully');

      return {
        id: recipe.id,
        name: recipe.name,
        postedBy: recipe.postedBy,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async findAll(
    @Res({ passthrough: true }) res: Response,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const pageNum = parseInt(page ?? '1');
      const limitNum = parseInt(limit ?? '10');

      const { recipes, total } = await this.recipesService.findAll(
        search,
        pageNum,
        limitNum,
      );

      setResponseMeta(res, 'recipes', 'Recipes fetched successfully');

      return { recipes, total, page: pageNum, limit: limitNum };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get('mine')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async getMyRecipes(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const pageNum = parseInt(page ?? '1');
      const limitNum = parseInt(limit ?? '10');

      const { recipes, total } = await this.recipesService.findByUser(
        req.user.id,
        pageNum,
        limitNum,
      );

      setResponseMeta(res, 'recipes', 'User recipes fetched successfully');

      return { recipes, total, page: pageNum, limit: limitNum };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async delete(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipe = await this.recipesService.findById(+id);
      if (!recipe) throw new NotFoundException('Recipe not found');

      await this.favoritesService.removeAllFavoritesForRecipe(+id);
      if (recipe.thumbnail) await this.cloudinaryUtils.deleteImage(recipe.thumbnail);

      await this.recipesService.deleteRecipe(+id, req.user.id);

      setResponseMeta(res, 'message', 'Recipe deleted successfully');

      return;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException)
        throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async getById(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipe = await this.recipesService.findById(+id);
      if (!recipe) throw new NotFoundException('Recipe not found');

      setResponseMeta(res, 'recipe', 'Recipe fetched successfully');

      return recipe;
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException)
        throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}
