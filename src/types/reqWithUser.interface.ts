import { Request } from "express";

import { User } from "../user/models/user.model";

export interface ReqWithUser extends Request {
  user: User;
}
