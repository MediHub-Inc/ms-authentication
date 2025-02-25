import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export const JWT_EXPIRATION_TIME = {
  ACCESS_TOKEN: 3600,
  REFRESH_TOKEN: 86400,
};

export const JWT_EXPIRATION_TIME_IN_MS = {
  ACCESS_TOKEN: 3600000,
  REFRESH_TOKEN: 86400000,
};