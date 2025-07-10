import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Recipe } from './entities/recipe.model';
import { User } from '../user/entities/user.model';
import { CloudinaryUtils } from '../../utils/cloudinary.utils';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [SequelizeModule.forFeature([Recipe, User]), FavoritesModule],
  controllers: [RecipesController],
  providers: [RecipesService, CloudinaryUtils],
})
export class RecipesModule {}
