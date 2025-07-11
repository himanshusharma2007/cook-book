import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize-typescript';

// Models
import { User } from '../modules/user/entities/user.model';
import { Recipe } from '../modules/recipes/entities/recipe.model';
import { Favorite } from '../modules/favorites/entities/favorite.model';

dotenv.config();

export class DatabaseConfig implements SequelizeOptionsFactory {
  async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    const options: SequelizeModuleOptions = {
      dialect: 'postgres',

      username: process.env.DB_USER || '',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'cookbook_db',
      host: process.env.DB_HOST || '',
      port: parseInt(process.env.DB_PORT || '5432'),
      models: [User, Recipe, Favorite],
      synchronize: false, // Disable auto-sync; rely on migrations
    };

    // Test database connection
    try {
      const testSequelize = new Sequelize(options);
      await testSequelize.authenticate();
      console.log(`✅ Database connected successfully  environment)`);
      await testSequelize.close();
    } catch (err: any) {
      console.error(`❌ Database connection failed  environment):`, err.message);
      throw err; // Rethrow to prevent app startup on connection failure
    }

    return options;
  }
}
