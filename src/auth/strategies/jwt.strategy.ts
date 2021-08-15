import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

import { UserService } from "../../user/user.service";
import { JwtPayload } from "../../types/jwtPayload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly configService: ConfigService, private readonly userService: UserService) {
    super({
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const data = request?.cookies["access-token"];

          if (!data) return null;

          return data;
        },
      ]),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload === null) throw new UnauthorizedException();

    return this.userService.findById(payload.id);
  }
}
