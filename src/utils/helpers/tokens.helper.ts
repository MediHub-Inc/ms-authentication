import type { Response } from 'express';
import { getExpiresInFromJwt } from './expires-in.helper';

export const setTokenInCookies = (tokenData, res: Response) => {
  res.cookie('factu_fazil_access_token', tokenData.accessToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    // domain: '',
    maxAge: tokenData.expiresIn * 1000, // converts to miliseconds
    path: '/',
    sameSite: true,
  });

  res.cookie('factu_fazil_refresh_token', tokenData.refreshToken, {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    // domain: '',
    maxAge: getExpiresInFromJwt(tokenData.refreshToken) * 1000, // converts to miliseconds
    path: '/',
    sameSite: true,
  });
};
