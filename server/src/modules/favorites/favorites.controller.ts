import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  Res,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { setResponseMeta } from 'src/utils/response.utils';
import { LogExecution } from 'src/common/decorators/log.decorator';

@Controller('favorites')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @LogExecution()
  async add(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipeId = parseInt(id);
      const favorite = await this.favoritesService.addFavorite(
        recipeId,
        req.user.id,
      );

      setResponseMeta(res, 'favoriteId', 'Recipe added to favorites');

      return favorite.id;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async findAll(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipes = await this.favoritesService.findAll(req.user.id);

      setResponseMeta(res, 'recipes', 'Favorites fetched successfully');

      return recipes;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipeId = parseInt(id);
      await this.favoritesService.removeFavorite(recipeId, req.user.id);

      setResponseMeta(res, 'message', 'Recipe removed from favorites');

      return null;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new NotFoundException(error.message);
    }
  }
}
