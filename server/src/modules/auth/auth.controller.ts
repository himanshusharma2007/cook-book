import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { setResponseMeta } from 'src/utils/response.utils';
import { LogExecution } from 'src/common/decorators/log.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @LogExecution()
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, token } = await this.authService.register(createUserDto);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      setResponseMeta(res, 'user', 'User registered successfully');

      return { id: user.id, name: user.name, email: user.email };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const { user, token } = await this.authService.login(loginDto);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      setResponseMeta(res, 'user', 'Login successful');

      return { id: user.id, name: user.name, email: user.email };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async getMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const user = await this.authService.getMe(req.user.id);

      setResponseMeta(res, 'user', 'User fetched successfully');

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new NotFoundException(error.message);
    }
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      setResponseMeta(res, 'message', 'Logged out successfully');
      return;
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }
}
