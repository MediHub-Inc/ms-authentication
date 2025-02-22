import { InternalServerErrorException } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { decode } from './base64.helper';

export const signToken = (content: any, expiresIn: string): string => {
  try {
    const privateKeyBase64 = process.env.JWT_SIGNING_PRIVATE_KEY_BASE64 as string;
    const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
    console.log('privateKey', privateKey);
    return sign(
      content,
      privateKey,
      {
        expiresIn: expiresIn,
        algorithm: 'RS256',
      },
    );
  } catch (error: any) {
    console.error('JWT Signing error:', error);
    throw new InternalServerErrorException(error.message);
  }
};
