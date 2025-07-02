import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../models/user.model";
import { AuthGuard } from "src/guards/auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
})
export class AuthModule {}