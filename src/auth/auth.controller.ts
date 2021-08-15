import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards, UsePipes } from "@nestjs/common";
import { Response } from "express";

import { SignupDto } from "./dto/signupDto";
import { AuthService } from "./auth.service";
import { ReqWithUser } from "../types/reqWithUser.interface";
import { LocalAuthGuard } from "./guards/local.guard";
import { JwtAuthGuard } from "./guards/jwt.guard";
import { RefreshAuthGuard } from "./guards/refresh.guard";
import { ForgotPasswordDto } from "./dto/forgotPasswordDto";
import { ResetPasswordDto } from "./dto/resetPasswordDto";
import { ValidMailPipe } from "../pipes/validMail.pipe";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  @UsePipes(ValidMailPipe)
  async signup(@Body() signupDto: SignupDto, @Res({ passthrough: true }) res: Response) {
    const { refreshTokenCookie, accessTokenCookie, user } = await this.authService.signup(signupDto);
    res.setHeader("Set-Cookie", [refreshTokenCookie, accessTokenCookie]);
    return user;
  }

  @Post("/login")
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: ReqWithUser, @Res({ passthrough: true }) res: Response) {
    const { refreshTokenCookie, accessTokenCookie, user } = await this.authService.login(req.user);
    res.setHeader("Set-Cookie", [refreshTokenCookie, accessTokenCookie]);
    return user;
  }

  @Get("/refresh")
  @UseGuards(RefreshAuthGuard)
  async refresh(@Req() req: ReqWithUser, @Res({ passthrough: true }) res: Response) {
    const { accessTokenCookie } = await this.authService.refresh(req?.user?.id);
    res.setHeader("Set-Cookie", accessTokenCookie);
    return req?.user;
  }

  @Post("/logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: ReqWithUser, @Res({ passthrough: true }) res: Response) {
    const cookies = await this.authService.logout(req?.user.id);
    res.setHeader("Set-Cookie", cookies);
    return req?.user;
  }

  @Post("/forgot-password")
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch("/reset-password")
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Delete("/account")
  @UseGuards(JwtAuthGuard)
  deleteAccount(@Req() req: ReqWithUser) {
    return this.authService.deleteAccount(req?.user.id);
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  me(@Req() req: ReqWithUser) {
    return req?.user;
  }
}
