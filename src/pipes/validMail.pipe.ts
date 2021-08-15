import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import * as MailChecker from "mailchecker";

export class ValidMailPipe implements PipeTransform {
  constructor(private readonly emailField: string = "email") {}

  transform(value: any, _: ArgumentMetadata): any {
    if (!MailChecker.isValid(value[this.emailField])) {
      throw new BadRequestException("Please enter a real email address");
    }

    return value;
  }
}
