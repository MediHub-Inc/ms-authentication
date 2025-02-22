import { InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { decode } from './base64.helper';

export const signToken = (content: any, expiresIn: string): string => {
  try {
    const privateKey = Buffer.from(process.env.JWT_SIGNING_PRIVATE_KEY_BASE64 as string, 'base64').toString('utf-8');
    return sign(
      content,
      decode(privateKey || ''),
      {
        expiresIn: expiresIn,
        algorithm: 'RS256',
      },
    );
  } catch (error: any) {
    throw new InternalServerErrorException(error.message);
  }
};
