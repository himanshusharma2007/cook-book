import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../models/user.model";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthMiddleware,
    },
  ],
})
export class AuthModule {}