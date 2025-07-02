import { Controller, Post, Body, Get, Query, Param, Delete, Req, UseGuards, HttpCode, HttpStatus, Res, UseInterceptors, UploadedFile } from "@nestjs/common";
import { RecipesService } from "../services/recipes.service";
import { Recipe } from "../models/recipe.model";
import { Request, Response } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("recipes")
export class RecipesController {
    constructor(private recipesService: RecipesService) { }
    @Post()
    @UseGuards(AuthMiddleware)
    @UseInterceptors(FileInterceptor("thumbnail"))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createRecipeDto: Partial<Recipe>,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            const thumbnail = file ? `/uploads/${file.filename}` : null;
            const recipeDto = { ...createRecipeDto, thumbnail };
            const recipe = await this.recipesService.createRecipe(recipeDto, req.user.id);
            return { recipe: { id: recipe.id, name: recipe.name, postedBy: recipe.postedBy }, message: "Recipe created successfully" };
        } catch (error) {
            return { statusCode: HttpStatus.BAD_REQUEST, message: error.message };
        }
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query("search") search?: string, @Query("page") page?: string, @Query("limit") limit?: string) {
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const { recipes, total } = await this.recipesService.findAll(search, pageNum, limitNum);
        return { recipes, total, page: pageNum, limit: limitNum };
    }

    @Delete(":id")
    @UseGuards(AuthMiddleware)
    @HttpCode(HttpStatus.OK)
    async delete(@Param("id") id: string, @Req() req: Request) {
        try {
            await this.recipesService.deleteRecipe(parseInt(id), req.user.id);
            return { message: "Recipe deleted successfully" };
        } catch (error) {
            return { statusCode: error.status || HttpStatus.NOT_FOUND, message: error.message };
        }
    }
}