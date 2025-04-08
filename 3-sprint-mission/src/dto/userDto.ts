export interface User {
  id?: number;
  email: string;
  nickname: string;
  password: string;
  image?: string | null;
  refreshToken?: string | null;
}

// 회원가입
export interface CreateUser {
  email: string;
  nickname: string;
  password: string;
  image?: string | null;
}

// 모든항목 옵셔널
export interface UpdateUser extends Partial<CreateUser> {}
