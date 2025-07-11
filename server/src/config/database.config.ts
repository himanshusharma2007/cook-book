import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Models
import { User } from '../modules/user/entities/user.model';
import { Recipe } from '../modules/recipes/entities/recipe.model';
import { Favorite } from '../modules/favorites/entities/favorite.model';

// Import the shared configuration
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dbConfig = require('./database.js');

dotenv.config();

export class DatabaseConfig implements SequelizeOptionsFactory {
  async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    const env = process.env.NODE_ENV || 'development';
    const config = dbConfig[env as keyof typeof dbConfig];

    const options: SequelizeModuleOptions = {
      dialect: config.dialect as Dialect,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.database,
      models: [User, Recipe, Favorite],
      synchronize: false, // Disable auto-sync; rely on migrations
      logging: env !== 'production' ? console.log : false, // Enable logging in non-production
      dialectOptions: config.dialectOptions || {}, // Include SSL for production
    };

    // Test database connection
    try {
      const testSequelize = new Sequelize(options);
      await testSequelize.authenticate();
      console.log(`✅ Database connected successfully (${env} environment)`);
      await testSequelize.close();
    } catch (err: any) {
      console.error(`❌ Database connection failed (${env} environment):`, err.message);
      throw err; // Rethrow to prevent app startup on connection failure
    }

    return options;
  }
}