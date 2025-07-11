import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.model';
import { sign, SignOptions } from 'jsonwebtoken';
import  * as dotenv from 'dotenv';
import { comparePassword, hashPassword } from 'src/utils/hash';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './types/jwt-payload';

dotenv.config();

@Injectable()
export class AuthService {
  /**
   * Registers a new user and returns user with JWT token.
   * @param createUserDto - User details (name, email, password).
   * @returns User and JWT token.
   * @throws UnauthorizedException if fields are missing.
   */
  async register(createUserDto: CreateUserDto): Promise<{ user: User; token: string }> {
    const { name, email, password } = createUserDto;

    if (!name || !email || !password) {
      throw new UnauthorizedException('All fields are required');
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const signOptions: SignOptions = {
      expiresIn: (jwtExpiresIn || '1h') as any,
    };
    

    const token = sign(
      { id: user.id, email: user.email } as JwtPayload,
      jwtSecret,
      signOptions
    );

    return { user, token };
  }

  /**
   * Authenticates user and returns user with JWT token.
   * @param loginDto - Login credentials (email, password).
   * @returns User and JWT token.
   * @throws UnauthorizedException if credentials are invalid.
   */
  async login(loginDto: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;
    const user = await User.findOne({ where: { email } });

    const isValid = user && (await comparePassword(password, user.password));
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const signOptions: SignOptions = {
      expiresIn: (jwtExpiresIn || '1h') as any,
    };
    

    const token = sign(
      { id: user.id, email: user.email } as JwtPayload,
      jwtSecret,
      signOptions
    );

    return { user, token };
  }

  /**
   * Fetches user details by ID, excluding password.
   * @param userId - User ID.
   * @returns User object.
   * @throws UnauthorizedException if user not found.
   */
  async getMe(userId: number): Promise<User> {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  /**
   * Validates user credentials.
   * @param email - User email.
   * @param plainPass - Plain text password.
   * @returns User (without password) or null if invalid.
   */
  async validateUser(email: string, plainPass: string): Promise<Omit<User, 'password'> | null> {
    const user = await User.findOne({ where: { email } });

    if (user && (await comparePassword(plainPass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user.toJSON();
      return rest;
    }

    return null;
  }
}