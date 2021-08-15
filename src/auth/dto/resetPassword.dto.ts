import { IsString, IsUUID, Matches } from "class-validator";

import { passwordRegex } from "../../constants/passwordRegex";

export class ResetPasswordDto {
  @IsString()
  @IsUUID()
  token: string;

  @IsString()
  @Matches(passwordRegex.regex, { message: passwordRegex.message })
  password: string;
}
