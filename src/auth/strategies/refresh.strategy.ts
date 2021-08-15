import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { UserService } from "../../user/user.service";
import { JwtPayload } from "../../types/jwtPayload.interface";

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "refresh") {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      secretOrKey: configService.get("JWT_REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies["refresh-token"];
        },
      ]),
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req?.cookies["refresh-token"];
    return this.userService.findByRefreshToken(refreshToken, payload.id);
  }
}
