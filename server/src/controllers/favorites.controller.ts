import { Controller, Post, Get, Delete, Param, Req, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
import { FavoritesService } from "../services/favorites.service";
import { Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("favorites")
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async add(@Param("id") id: string, @Req() req: Request) {
    try {
      if (!req.user) throw new Error("Unauthorized");
      const recipeId = parseInt(id);
      const favorite = await this.favoritesService.addFavorite(recipeId, req.user.id);
      return { success: true, message: "Recipe added to favorites", favoriteId: favorite.id };
    } catch (error) {
      return { success: false, statusCode: error.status || HttpStatus.BAD_REQUEST, message: error.message };
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request) {
    try {
      if (!req.user) throw new Error("Unauthorized");
      const recipes = await this.favoritesService.findAll(req.user.id);
      return { success: true, recipes };
    } catch (error) {
      return { success: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message };
    }
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@Param("id") id: string, @Req() req: Request) {
    try {
      if (!req.user) throw new Error("Unauthorized");
      const recipeId = parseInt(id);
      await this.favoritesService.removeFavorite(recipeId, req.user.id);
      return { success: true, message: "Recipe removed from favorites" };
    } catch (error) {
      return { success: false, statusCode: error.status || HttpStatus.NOT_FOUND, message: error.message };
    }
  }
}