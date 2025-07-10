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

@Table({ tableName: 'recipes', timestamps: true })
export class Recipe extends Model {
  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare instructions: string;

  @Column({ type: DataType.ARRAY(DataType.STRING), allowNull: false })
  declare ingredients: string[];

  @Column({ type: DataType.STRING, allowNull: true })
  declare thumbnail: string;

  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  declare postedAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare postedBy: number;

  @BelongsTo(() => User)
  declare user: User;

  @CreatedAt
  @Column({ type: DataType.DATE })
  declare createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  declare updatedAt: Date;
}
