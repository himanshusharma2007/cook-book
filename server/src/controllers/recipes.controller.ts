import { Controller, Post, Body, Get, Query, Param, Delete, Req, UseGuards, HttpCode, HttpStatus, Res, UseInterceptors, UploadedFile, UnauthorizedException, BadRequestException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { RecipesService } from "../services/recipes.service";
import { Recipe } from "../models/recipe.model";
import { Request, Response } from "express";
import { AuthGuard } from "src/guards/auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";

@Controller("recipes")
export class RecipesController {
    constructor(private recipesService: RecipesService) { }
    
    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("thumbnail", {
        storage: multer.diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
            }
        })
    }))
    @HttpCode(HttpStatus.CREATED)
    async create(
        @UploadedFile() file: multer.File,
        @Body() createRecipeDto: Partial<Recipe>,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        try {
            if (!req.user) {
                throw new UnauthorizedException("Unauthorized");
            }

            const thumbnail = file ? `/uploads/${file.filename}` : undefined;
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
        } catch (error) {
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
        } catch (error) {
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
            await this.recipesService.deleteRecipe(parseInt(id), req.user.id);
            return { success: true, message: "Recipe deleted successfully" };
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new NotFoundException(error.message);
        }
    }
}