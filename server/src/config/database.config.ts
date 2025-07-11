import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize/types';
import { Sequelize } from 'sequelize-typescript';

// Models
import { User } from '../modules/user/entities/user.model';
import { Recipe } from '../modules/recipes/entities/recipe.model';
import { Favorite } from 'src/modules/favorites/entities/favorite.model';

dotenv.config();

export class DatabaseConfig implements SequelizeOptionsFactory {
  async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    const options: SequelizeModuleOptions = {
      dialect: 'postgres' as Dialect,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [User, Recipe, Favorite],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    };

    // Test connection manually
    try {
      const testSequelize = new Sequelize(options);
      await testSequelize.authenticate();
      console.log('✅ Database connected successfully');
      await testSequelize.close();
    } catch (err : any) {
      console.error('❌ Database connection failed:', err.message);
    }

    return options;
  }
}
