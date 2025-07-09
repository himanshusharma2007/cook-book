import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { DatabaseConfig } from "./config/database.config";
import { AuthModule } from "./routes/auth.module";
import { RecipesModule } from "./routes/recipes.module";
import { FavoritesModule } from "./routes/favorites.module";
import { User } from "./models/user.model";
import { Recipe } from "./models/recipe.model";
import { Favorite } from "./models/favorite.model";

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