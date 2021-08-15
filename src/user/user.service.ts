import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import * as argon2 from "argon2";

import { User } from "./models/user.model";
import { ChangeUserDetailsDto } from "./dto/changeUserDetails.dto";

@Injectable()
export class UserService {
  constructor(@Inject(User) private readonly userModel: typeof User) {}

  public async create(email: string, name: string, hash: string) {
    const user = await this.findByEmail(email);

    if (!!user) throw new BadRequestException("User with such email already exists");

    return this.userModel.query().insert({ email, name, hash });
  }

  public findById(userId: string) {
    return this.userModel.query().findOne("id", userId);
  }

  public findByEmail(email: string) {
    return this.userModel.query().findOne("email", email);
  }

  public async findByRefreshToken(refreshToken: string, userId: string) {
    const user = await this.findById(userId);

    if (!user) throw new UnauthorizedException();

    if (await argon2.verify(user.currentHashedRefreshToken, refreshToken)) {
      return user;
    }
  }

  public async setCurrentRefreshToken(refreshToken, userId: string) {
    const hash = await argon2.hash(refreshToken);
    return this.userModel.query().patchAndFetchById(userId, {
      currentHashedRefreshToken: hash,
    });
  }

  public async removeCurrentRefreshToken(userId: string) {
    return this.userModel.query().patchAndFetchById(userId, {
      currentHashedRefreshToken: null,
    });
  }

  public async deleteById(userId: string) {
    return this.userModel.query().deleteById(userId);
  }

  public async setDetails(userId: string, changeUserDetailsDto: ChangeUserDetailsDto) {
    return this.userModel.query().patchAndFetchById(userId, changeUserDetailsDto);
  }
}
