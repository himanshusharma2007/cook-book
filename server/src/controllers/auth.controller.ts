import { Controller, Post, Body, Res, Get, Req, UseGuards, HttpCode, HttpStatus } from "@nestjs/common";
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
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
            return { success: true, user: { id: user.id, name: user.name, email: user.email }, message: "User registered successfully" };
        } catch (error) {
            return { success: false, statusCode: HttpStatus.BAD_REQUEST, message: error.message };
        }
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: { email: string; password: string }, @Res({ passthrough: true }) res: Response) {
        try {
            const { user, token } = await this.authService.login(loginDto);
            res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
            return { success: true, user: { id: user.id, name: user.name, email: user.email }, message: "Login successful" };
        } catch (error) {
            return { success: false, statusCode: HttpStatus.UNAUTHORIZED, message: error.message };
        }
    }

    @Get("me")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async getMe(@Req() req: Request) {
        try {
            if (!req.user) throw new Error("Unauthorized");
            const user = await this.authService.getMe(req.user.id);
            return { success: true, user };
        } catch (error) {
            return { success: false, statusCode: HttpStatus.NOT_FOUND, message: error.message };
        }
    }

    @Post("logout")
    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response) {
        try {
            res.clearCookie("token");
            return { success: true, message: "Logged out successfully" };
        } catch (error) {
            return { success: false, statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: "Logout failed" };
        }
    }
}