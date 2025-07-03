import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { initializeDatabase } from "./models/index";
import { join } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, "..", "uploads"), { prefix: "/uploads/" });
  app.enableCors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  });

  await initializeDatabase();
  await app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  });
}
bootstrap();