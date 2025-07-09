import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { User } from "./user.model";

@Table({ tableName: "recipes", timestamps: true })
export class Recipe extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  instructions: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  ingredients: string[];

  @Column({ type: DataType.STRING, allowNull: true })
  thumbnail: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  postedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  postedBy: number;

  @BelongsTo(() => User)
  user: User;
}