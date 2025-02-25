import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

export function generateAccessToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
}

export function generateRefreshToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
