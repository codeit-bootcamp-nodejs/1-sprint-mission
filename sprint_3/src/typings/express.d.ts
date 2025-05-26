import { JwtPayload } from "jsonwebtoken";

export interface User {
  id: number;
  email: string;
  nickname: string;
  image?: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
