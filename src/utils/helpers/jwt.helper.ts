/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import * as jwt from 'jsonwebtoken';

export function generateAccessToken(userId: string) {
  const privateKey = Buffer.from(
    process.env.JWT_PRIVATE_KEY_BASE64 || '',
    'base64',
  ).toString('utf-8');

  console.log('privateKey: ', privateKey);
  return jwt.sign({ userId }, privateKey, {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_EXPIRATION_TIME_ACCESS || '1h',
  });
}

export function generateRefreshToken(userId: string) {
  const privateKey = Buffer.from(
    process.env.JWT_PRIVATE_KEY_BASE64 || '',
    'base64',
  ).toString('utf-8');

  return jwt.sign({ userId }, privateKey, {
    algorithm: 'RS256',
    expiresIn: process.env.JWT_EXPIRATION_TIME_REFRESH || '7d',
  });
}

export function verifyToken(token: string) {
  const publicKey = Buffer.from(
    process.env.JWT_PUBLIC_KEY_BASE64 || '',
    'base64',
  ).toString('utf-8');

  return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as {
    userId: string;
  };
}

export const JWT_EXPIRATION_TIME = {
  ACCESS_TOKEN: 3600,
  REFRESH_TOKEN: 86400,
};

export const JWT_EXPIRATION_TIME_IN_MS = {
  ACCESS_TOKEN: 3600000,
  REFRESH_TOKEN: 86400000,
};
