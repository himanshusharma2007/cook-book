import { Sequelize } from "sequelize-typescript";
import { User } from "./user.model.ts";
import { Recipe } from "./recipe.model.ts";
import { Favorite } from "./favorite.model.ts";
import * as dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  models: [User, Recipe, Favorite],
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    await sequelize.sync({ alter: true }); // Adjusts tables, use { force: true } only for testing
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

export default sequelize;