import { Module } from "@nestjs/common";
import { RecipesController } from "../controllers/recipes.controller";
import { RecipesService } from "../services/recipes.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";
import { CloudinaryUtils } from '../utils/cloudinary.utils';
import { FavoritesModule } from "./favorites.module";
@Module({
  imports: [SequelizeModule.forFeature([Recipe, User]),FavoritesModule],
  controllers: [RecipesController],
  providers: [RecipesService,CloudinaryUtils],
})
export class RecipesModule {}