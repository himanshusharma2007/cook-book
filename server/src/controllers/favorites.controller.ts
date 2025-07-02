import { Controller, Post, Get, Delete, Param, Req, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { FavoritesService } from "../services/favorites.service";
import { Request } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";

@Controller("favorites")
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post(":id")
  @UseGuards(AuthMiddleware)
  @HttpCode(HttpStatus.CREATED)
  async add(@Param("id") id: string, @Req() req: Request) {
    try {
      const recipeId = parseInt(id);
      const favorite = await this.favoritesService.addFavorite(recipeId, req.user.id);
      return { message: "Recipe added to favorites", favoriteId: favorite.id };
    } catch (error) {
      return { statusCode: error.status || HttpStatus.BAD_REQUEST, message: error.message };
    }
  }

  @Get()
  @UseGuards(AuthMiddleware)
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    try {
      const recipes = await this.favoritesService.findAll(req.user.id);
      return { recipes };
    } catch (error) {
      return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  @Delete(":id")
  @UseGuards(AuthMiddleware)
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string, @Req() req: Request) {
    try {
      const recipeId = parseInt(id);
      await this.favoritesService.removeFavorite(recipeId, req.user.id);
      return { message: "Recipe removed from favorites" };
    } catch (error) {
      return { statusCode: error.status || HttpStatus.NOT_FOUND, message: error.message };
    }
  }
}