import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.model';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { comparePassword, hashPassword } from 'src/utils/hash';

dotenv.config();

@Injectable()
export class AuthService {
  async register(createUserDto: Partial<User>): Promise<{ user: User; token: string }> {
    const { name, email, password } = createUserDto;
    if (!name || !email || !password) {
      throw new UnauthorizedException('All fields are required');
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { user, token };
  }

  async login(loginDto: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const { email, password } = loginDto;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await comparePassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return { user, token };
  }

  async getMe(userId: number): Promise<User> {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await User.findOne({ where: { email } });
    if (user && await comparePassword(password, user.password)) {
      const { password, ...result } = user.toJSON();
      return result;
    }
    return null;
  }

  async logout(): Promise<void> {
    // No server-side token storage, client clears cookie
    return;
  }
}