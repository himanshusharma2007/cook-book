import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "../models/user.model";


@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [
    AuthService
  ],
})
export class AuthModule {}