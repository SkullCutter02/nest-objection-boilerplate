import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";

import { configModuleOptions } from "./config/configModuleOptions";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { RedisModule } from "./redis/redis.module";

@Module({
  imports: [ConfigModule.forRoot(configModuleOptions), DatabaseModule, UserModule, AuthModule, MailModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
