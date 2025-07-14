import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const cookieExtractor = (req: Request): string | null => {
      if (req && req.cookies && typeof req.cookies.token === 'string') {
        return req.cookies.token;
      }
      return null;
    };

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: process.env.JWT_SECRET ?? '',
    });
  }

  validate(payload: { id: number; email: string }) {
    return { id: payload.id, email: payload.email };
  }
}
