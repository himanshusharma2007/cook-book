import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
}

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.token;

    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
      req.user = decoded;
      next();
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}