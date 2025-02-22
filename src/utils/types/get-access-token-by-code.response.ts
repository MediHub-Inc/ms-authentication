export type GetAccessTokenByCodeResponse = {
  accessToken: string;
  idToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  scope?: string;
};
