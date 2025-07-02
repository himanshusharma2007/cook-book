import { Module } from "@nestjs/common";
import { FavoritesController } from "../controllers/favorites.controller";
import { FavoritesService } from "../services/favorites.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Favorite } from "../models/favorite.model";
import { Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";

@Module({
  imports: [SequelizeModule.forFeature([Favorite, Recipe, User])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}