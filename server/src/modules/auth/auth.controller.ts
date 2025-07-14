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
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { setResponseMeta } from 'src/utils/response.utils';
import { LogExecution } from 'src/common/decorators/log.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { getUserId } from 'src/utils/auth.utils';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * Registers a new user and sets JWT cookie.
   * @param createUserDto - User details.
   * @param res - Response object for setting cookie.
   * @returns User details (id, name, email).
   * @throws BadRequestException on registration error.
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @LogExecution()
  async register(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    try {
      const { user, token } = await this.authService.register(createUserDto);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      setResponseMeta(res, 'user', 'User registered successfully');

      return { id: user.id, name: user.name, email: user.email };
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Logs in user and sets JWT cookie.
   * @param loginDto - Login credentials.
   * @param res - Response object for setting cookie.
   * @returns User details (id, name, email).
   * @throws UnauthorizedException on login failure.
   */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    try {
      const { user, token } = await this.authService.login(loginDto);

      res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      setResponseMeta(res, 'user', 'Login successful');

      return { id: user.id, name: user.name, email: user.email };
    } catch (error: any) {
      throw new UnauthorizedException(error.message);
    }
  }

  /**
   * Fetches authenticated user's details.
   * @param req - Request object with user data.
   * @param res - Response object for metadata.
   * @returns User details.
   * @throws UnauthorizedException if not authenticated.
   * @throws NotFoundException if user not found.
   */
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  async getMe(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.user) throw new UnauthorizedException('Unauthorized');

      const user = await this.authService.getMe(getUserId(req));

      setResponseMeta(res, 'user', 'User fetched successfully');

      return user;
    } catch (error: any) {
      if (error instanceof UnauthorizedException) throw error;
      throw new NotFoundException(error.message);
    }
  }

  /**
   * Logs out user by clearing JWT cookie.
   * @param res - Response object for clearing cookie.
   */
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  @LogExecution()
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    setResponseMeta(res, 'message', 'Logged out successfully');
  }
}
