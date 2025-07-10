import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorite } from './entities/favorite.model';
import { Recipe } from '../recipes/entities/recipe.model';
import { User } from '../user/entities/user.model';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [SequelizeModule.forFeature([Favorite, Recipe, User])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
