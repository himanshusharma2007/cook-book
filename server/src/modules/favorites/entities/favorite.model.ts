import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';
import { User } from '../../user/entities/user.model';
import { Recipe } from '../../recipes/entities/recipe.model';

@Table({ tableName: 'favorites', timestamps: true })
export class Favorite extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number;

  @ForeignKey(() => Recipe)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare recipeId: number;

  @BelongsTo(() => User)
  declare user: User;

  @BelongsTo(() => Recipe)
  declare recipe: Recipe;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
