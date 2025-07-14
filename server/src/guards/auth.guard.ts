import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: number;
  email: string;
}

declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest();
    const token = req.cookies?.token;


    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      if (typeof token === 'string') {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        req.user = decoded;
        return true;
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error : any) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
