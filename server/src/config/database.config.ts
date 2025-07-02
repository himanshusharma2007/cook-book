import { SequelizeModuleOptions, SequelizeOptionsFactory } from "@nestjs/sequelize";
import * as dotenv from "dotenv";
import { Dialect } from "sequelize/types";

dotenv.config();

export class DatabaseConfig implements SequelizeOptionsFactory {
  createSequelizeOptions(): SequelizeModuleOptions {
    return {
      dialect: "postgres" as Dialect,
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: process.env.NODE_ENV !== "production", // Disable in production
      logging: process.env.NODE_ENV !== "production", // Log SQL in dev
    };
  }
}