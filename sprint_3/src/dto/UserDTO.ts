export interface UserDTO {
  id: number;
  nickname: string;
  email: string;
  password: string;
  image?: string | null;
  refreshToken?: string | null;
}

export interface CreateUserDTO {
  nickname: string;
  email: string;
  password: string;
  image?: string | null;
}


export interface UpdateUserDTO {
  nickname?: string;
  password?: string;
  image?: string | null;
  refreshToken?: string;
}

export type TokenType = "access" | "refresh";
