// src/modules/recipes/dto/recipe.dto.ts
import { IsNotEmpty, IsString, IsArray, IsOptional } from 'class-validator';

export class CreateRecipeDto {
  @IsNotEmpty({ message: 'Recipe name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Instructions are required' })
  @IsString()
  instructions: string;

  @IsArray({ message: 'Ingredients must be an array of strings' })
  @IsNotEmpty({
    each: true,
    message: 'Each ingredient must be a non-empty string',
  })
  ingredients: string[];

  @IsOptional()
  @IsString()
  thumbnail?: string;
}
