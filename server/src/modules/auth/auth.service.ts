import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.model';
import { sign, SignOptions } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { comparePassword } from 'src/utils/hash';
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

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // password gets hashed before saving
    const user = await User.create({ name, email, password });
    console.log('check', user);

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const signOptions: SignOptions = {
      expiresIn: (jwtExpiresIn || '1h') as any,
    };

    const token = sign({ id: user.id, email: user.email } as JwtPayload, jwtSecret, signOptions);
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
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'password', 'name'],
      raw: true,
    });

    console.log('user in login', user);
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

    const token = sign({ id: user.id, email: user.email } as JwtPayload, jwtSecret, signOptions);

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
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await User.unscoped().findOne({ where: { email } });

    if (!user) {
      return null;
    }
    if (!user.password) {
      throw new Error('Password not found for user');
    }
    if (await comparePassword(pass, String(user.dataValues.password))) {
      const result = user.toJSON();
      return result;
    }

    console.log('Invalid password');
    return null;
  }
}
