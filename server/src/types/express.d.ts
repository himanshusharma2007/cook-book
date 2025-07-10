// src/types/express.d.ts
import { JwtPayload } from '../modules/auth/types/jwt-payload'; // or wherever your payload is

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
