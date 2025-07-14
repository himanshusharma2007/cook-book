import { Controller, Post, Body, Get, Query, Param, Delete, Req, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { RecipesService } from "../services/recipes.service";
import { Recipe } from "../models/recipe.model";
import { Request, Response } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { CloudinaryUtils } from "../utils/cloudinary.utils";
import { FavoritesService } from "../services/favorites.service";

@Controller("recipes")
export class RecipesController {
  constructor(
    private recipesService: RecipesService,
    private cloudinaryUtils: CloudinaryUtils,
    private favoritesService: FavoritesService // Inject FavoritesService
  ) {}
    
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("thumbnail", {
    storage: new CloudinaryUtils().getStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  }))
  @HttpCode(HttpStatus.CREATED)
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRecipeDto: Partial<Recipe>,
    @Req() req: Request  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedException("Unauthorized");
      }

      const thumbnail = file?.path; // Cloudinary URL from multer-storage-cloudinary
      const recipeDto = { ...createRecipeDto, thumbnail };
      const recipe = await this.recipesService.createRecipe(recipeDto, req.user.id);

      return {
        success: true,
        recipe: {
          id: recipe.id,
          name: recipe.name,
          postedBy: recipe.postedBy
        },
        message: "Recipe created successfully"
      };
    } catch (error : any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@Query("search") search?: string, @Query("page") page?: string, @Query("limit") limit?: string) {
    try {
      const pageNum = parseInt(page ?? "1");
      const limitNum = parseInt(limit ?? "10");
      const { recipes, total } = await this.recipesService.findAll(search, pageNum, limitNum);
      return { success: true, recipes, total, page: pageNum, limit: limitNum };
    } catch (error : any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get("mine")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMyRecipes(
    @Req() req: Request,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ) {
    try {
      if (!req.user) {
        throw new UnauthorizedException("Unauthorized");
      }
      const pageNum = parseInt(page ?? "1");
      const limitNum = parseInt(limit ?? "10");
      const { recipes, total } = await this.recipesService.findByUser(req.user.id, pageNum, limitNum);
      return { success: true, recipes, total, page: pageNum, limit: limitNum };
    } catch (error : any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@Param("id") id: string, @Req() req: Request) {
    try {
      if (!req.user) {
        throw new UnauthorizedException("Unauthorized");
      }
      const recipe = await this.recipesService.findById(parseInt(id));
      if (!recipe) {
        throw new NotFoundException("Recipe not found");
      }

      // Remove all favorites for this recipe
      await this.favoritesService.removeAllFavoritesForRecipe(parseInt(id));

      // Delete image from Cloudinary if it exists
      if (recipe.thumbnail) {
        await this.cloudinaryUtils.deleteImage(recipe.thumbnail);
      }

      await this.recipesService.deleteRecipe(parseInt(id), req.user.id);
      return { success: true, message: "Recipe deleted successfully" };
    } catch (error : any) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @Get(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getById(@Param("id") id: string, @Req() req: Request) {
    try {
      if (!req.user) {
        throw new UnauthorizedException("Unauthorized");
      }
      const recipe = await this.recipesService.findById(parseInt(id));
      if (!recipe) {
        throw new NotFoundException("Recipe not found");
      }
      return { success: true, recipe };
    } catch (error :any) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }
}