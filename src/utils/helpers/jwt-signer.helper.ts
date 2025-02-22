import { InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { decode } from './base64.helper';

export const signToken = (content: any, expiresIn: string): string => {
  try {
    return sign(
      content,
      decode(process.env.JWT_SIGNING_PRIVATE_KEY_BASE64 || ''),
      {
        expiresIn: expiresIn,
        algorithm: 'RS256',
      },
    );
  } catch (error: any) {
    throw new InternalServerErrorException(error.message);
  }
};
