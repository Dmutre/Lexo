export interface IRegisterPayload {
  username: string;
  email: string;
  password: string;
  avatarUrl: string | null;
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken: string;
}
