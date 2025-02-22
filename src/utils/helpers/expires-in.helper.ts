import { decode } from 'jsonwebtoken';

export const getExpiresInFromJwt = (accessToken: string): number => {
  try {
    const decodedAccessToken = JSON.parse(JSON.stringify(decode(accessToken)));
    const accessTokenExp = decodedAccessToken.exp;
    const now = new Date().getTime() / 1000;
    const expirationTime = accessTokenExp > now ? accessTokenExp - now : 0;
    return Math.floor(expirationTime);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
