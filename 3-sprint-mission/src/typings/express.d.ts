import { Request } from "express";
import { jwtPayload } from "../dto/index";

declare module "express" {
  export interface Request {
    user?: JwtPayload;
  }
}

/*
 ** 옵셔널 지정안하면 초기값 없을수도있어서? verifyAcceesstoken오류남
 **
 */
