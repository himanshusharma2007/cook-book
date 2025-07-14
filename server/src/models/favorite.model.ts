import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user.model";
import { Recipe } from "./recipe.model";

@Table({ tableName: "favorites", timestamps: false })
export class Favorite extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  userId!: number;

  @ForeignKey(() => Recipe)
  @Column({ type: DataType.INTEGER, allowNull: false })
  recipeId!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Recipe)
  recipe!: Recipe;
}
