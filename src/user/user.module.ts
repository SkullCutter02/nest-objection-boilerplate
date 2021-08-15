import { ObjectionModule } from "@willsoto/nestjs-objection";
import { Module } from "@nestjs/common";

import { UserService } from "./user.service";
import { User } from "./models/user.model";
import { UserController } from './user.controller';

@Module({
  imports: [ObjectionModule.forFeature([User])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
