import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { v4 as uuid } from "uuid";

import { UserService } from "../user/user.service";
import { SignupDto } from "./dto/signupDto";
import { User } from "../user/models/user.model";
import { ForgotPasswordDto } from "./dto/forgotPasswordDto";
import { MailService } from "../mail/mail.service";
import { ResetPasswordDto } from "./dto/resetPasswordDto";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
  ) {}

  public async signup({ email, name, password }: SignupDto) {
    const hash = await argon2.hash(password);
    const user = await this.userService.create(email, name, hash);

    return this.handleCookies(user.id);
  }

  public async login(user: User) {
    return this.handleCookies(user.id);
  }

  public async refresh(userId: string) {
    const { cookie } = await this.getAccessTokenCookie(userId);
    return { accessTokenCookie: cookie };
  }

  public async logout(userId: string) {
    await this.userService.removeCurrentRefreshToken(userId);
    return this.getLogoutCookies();
  }

  public async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new BadRequestException("User with such email does not exist");

    const token = uuid();

    await this.redisService.set(token, user.id, 3600);

    const html = this.mailService.compileHTML<{ link: string }>("resetPasswordTemplate.html", {
      link: `${this.configService.get("RESET_PASSWORD_REDIRECT_URL")}${token}`,
    });
    await this.mailService.send(html, "Reset password email", email); // TODO: change values

    return { message: "Email Sent" };
  }

  public async resetPassword({ password, token }: ResetPasswordDto) {
    const userId = await this.redisService.get<string>(token);

    if (!userId) throw new BadRequestException("Reset password failed. Either try again or send a new email");

    const user = await this.userService.findById(userId);

    if (!user) throw new BadRequestException("Reset password failed. Either try again or send a new email");

    const hash = await argon2.hash(password);
    await user.$query().patch({ hash });

    await this.redisService.del(token);
    return user;
  }

  public async deleteAccount(userId: string) {
    const deletedItems = await this.userService.deleteById(userId);

    if (deletedItems <= 0) throw new BadRequestException("User with this ID not found");

    return { message: "User deleted" };
  }

  public async validateUserCredentials(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) throw new UnauthorizedException();
    if (!(await argon2.verify(user.hash, password))) throw new UnauthorizedException();

    return user;
  }

  private async handleCookies(userId: string) {
    const { cookie: accessTokenCookie } = await this.getAccessTokenCookie(userId);
    const { cookie: refreshTokenCookie, token: refreshToken } = await this.getRefreshTokenCookie(userId);

    const user = await this.userService.setCurrentRefreshToken(refreshToken, userId);

    return { accessTokenCookie, refreshTokenCookie, user };
  }

  private async getAccessTokenCookie(userId: string) {
    const token = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
        expiresIn: this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME"),
      },
    );
    const cookie = `access-token=${token}; HttpOnly; Path=/; Secure; Max-Age=${this.configService.get<number>(
      "JWT_ACCESS_TOKEN_EXPIRATION_TIME",
    )}`;
    return { cookie, token };
  }

  private async getRefreshTokenCookie(userId: string) {
    const token = await this.jwtService.signAsync(
      { id: userId },
      {
        secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
        expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME"),
      },
    );
    const cookie = `refresh-token=${token}; HttpOnly; Path=/; Secure; Max-Age=${this.configService.get<number>(
      "JWT_REFRESH_TOKEN_EXPIRATION_TIME",
    )}`;
    return { cookie, token };
  }

  private async getLogoutCookies() {
    return [
      "access-token=; HttpOnly; Secure; Path=/; Max-Age=0",
      "refresh-token=; HttpOnly; Secure; Path=/; Max-Age=0",
    ];
  }
}
