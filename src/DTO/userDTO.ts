import { User } from '../types/user';

export const userResponseDTO = (user: User) => {
  return {
    id: user.id,
    email: user.email,
    nickname: user.nickname,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export interface UserResponseDTO {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  nickname: string;
  password: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface updateUserDTO {
  email?: string;
  nickname?: string;
  image?: string | null;
}

export interface passwordDTO {
  password: string;
}
