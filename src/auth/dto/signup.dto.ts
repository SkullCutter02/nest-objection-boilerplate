import { IsEmail, IsString, Matches } from "class-validator";

import { passwordRegex } from "../../constants/passwordRegex";

export class SignupDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(passwordRegex.regex, { message: passwordRegex.message })
  password: string;
}
