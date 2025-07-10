import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DatabaseConfig } from "./config/database.config";
import { AuthModule } from "./modules/auth/auth.module";
import { RecipesModule } from "./modules/recipes/recipes.module";
import { FavoritesModule } from "./modules/favorites/favorites.module";
import { User } from "./modules/user/entities/user.model";
import { Recipe } from "./modules/recipes/entities/recipe.model";
import { Favorite } from "./modules/favorites/entities/favorite.model";


@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    SequelizeModule.forFeature([User, Recipe, Favorite]),
    AuthModule,
    RecipesModule,
    FavoritesModule,
  ],
})
export class AppModule {}