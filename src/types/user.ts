export interface User {
  id: number;
  email: string;
  nickname: string;
  image: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPayload {
  id: number;
}

export type UserWithoutPassword = Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>;
