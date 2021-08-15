import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { htmlToText } from "nodemailer-html-to-text";
import juice from "juice";
import * as handlebars from "handlebars";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class MailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport(
      nodemailerSendgrid({
        apiKey: this.configService.get("SENDGRID_API_KEY"),
      }),
    ).use("compile", htmlToText());
  }

  compileHTML<T = {}>(file: string, variables?: T) {
    const source = fs.readFileSync(path.join(__dirname, "templates", file), "utf-8").toString();
    const html = handlebars.compile(source)(variables);
    return juice(html);
  }

  // TODO: change default sender
  send(html: string, subject: string, to: string, from: string = "coolalan2016@gmail.com") {
    return this.transporter.sendMail({ from, to, subject, html });
  }
}
