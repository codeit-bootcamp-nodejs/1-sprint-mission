import { Request } from "express";

// Request객체에 사용자 인증 추가 (auth속성)
export interface AuthRequest extends Request {
  auth: { userId: number };
}

export interface jwtPayload {
  id: number;
  email: string;
  name: string;
}

export interface StatusError extends Error {
  status?: number;
}
