import { Module } from "@nestjs/common";
import { RecipesController } from "../controllers/recipes.controller";
import { RecipesService } from "../services/recipes.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { Recipe } from "../models/recipe.model";
import { User } from "../models/user.model";

@Module({
  imports: [SequelizeModule.forFeature([Recipe, User])],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}