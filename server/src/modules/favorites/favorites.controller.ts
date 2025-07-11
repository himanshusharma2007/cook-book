import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { setResponseMeta } from 'src/utils/response.utils';
import { LogExecution } from 'src/common/decorators/log.decorator';
import { getUserId } from 'src/utils/auth.utils';

/**
 * Controller for managing user favorite recipes.
 */
@Controller('favorites')
export class FavoritesController {
 
  constructor(private favoritesService: FavoritesService) {}

  /**
   * Adds a recipe to the authenticated user's favorites.
   * @param id - Recipe ID to add.
   * @param req - Request object with user data.
   * @param res - Response object for setting metadata.
   * @returns The ID of the created favorite.
   * @throws UnauthorizedException if user is not authenticated.
   * @throws BadRequestException if the request is invalid or recipe already favorited.
   */
  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  @LogExecution()
  async add(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipeId = parseInt(id, 10);
      if (isNaN(recipeId)) throw new BadRequestException('Invalid recipe ID');

      const favorite = await this.favoritesService.addFavorite(recipeId, getUserId(req));

      setResponseMeta(res, 'favoriteId', 'Recipe added to favorites');

      return favorite.id;
    } catch (error : any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Retrieves all favorite recipes for the authenticated user.
   * @param req - Request object with user data.
   * @param res - Response object for setting metadata.
   * @returns List of favorite recipes.
   * @throws UnauthorizedException if user is not authenticated.
   * @throws BadRequestException on service error.
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async findAll(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipes = await this.favoritesService.findAll(getUserId(req));

      setResponseMeta(res, 'recipes', 'Favorites fetched successfully');

      return recipes;
    } catch (error : any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Removes a recipe from the authenticated user's favorites.
   * @param id - Recipe ID to remove.
   * @param req - Request object with user data.
   * @param res - Response object for setting metadata.
   * @throws UnauthorizedException if user is not authenticated.
   * @throws NotFoundException if favorite is not found.
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const recipeId = parseInt(id, 10);
      if (isNaN(recipeId)) throw new BadRequestException('Invalid recipe ID');

       
      await this.favoritesService.removeFavorite(recipeId, getUserId(req));

      setResponseMeta(res, 'message', 'Recipe removed from favorites');

      return null;
    } catch (error : any) {
      if (error instanceof UnauthorizedException || error instanceof NotFoundException) throw error;
      throw new BadRequestException(error.message);
    }
  }
}
