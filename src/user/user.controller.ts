import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";

import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards/jwt.guard";
import { ReqWithUser } from "../types/reqWithUser.interface";
import { ChangeUserDetailsDto } from "./dto/changeUserDetails.dto";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  changeUserDetails(@Req() req: ReqWithUser, @Body() changeUserDetailsDto: ChangeUserDetailsDto) {
    return this.userService.setDetails(req?.user.id, changeUserDetailsDto);
  }
}
