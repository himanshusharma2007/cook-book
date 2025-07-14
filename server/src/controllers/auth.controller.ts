import { Controller, Post, Body, Res, Get, Req, UseGuards, HttpCode, HttpStatus, BadRequestException, UnauthorizedException, NotFoundException, InternalServerErrorException } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { User } from "../models/user.model";
import { Response, Request } from "express";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() createUserDto: Partial<User>, @Res({ passthrough: true }) res: Response) {
        try {
            const { user, token } = await this.authService.register(createUserDto);
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", });
            return { success: true, user: { id: user.id, name: user.name, email: user.email }, message: "User registered successfully" };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
        try {
            const { user, token } = await this.authService.login(loginDto);
            res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", });
            return { success: true, user: { id: user.id, name: user.name, email: user.email }, message: "Login successful" };
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

    @Get("me")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getMe(@Req() req: Request) {
        try {
            if (!req.user) throw new UnauthorizedException("Unauthorized");
            const user = await this.authService.getMe(req.user.id);
            return { success: true, user };
        } catch (error) {
            if (error instanceof UnauthorizedException) throw error;
            throw new NotFoundException(error.message);
        }
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response) {
        try {
            res.clearCookie("token", {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            return { success: true, message: "Logged out successfully" };
        } catch (error) {
            throw new InternalServerErrorException("Logout failed");
        }
    }
}