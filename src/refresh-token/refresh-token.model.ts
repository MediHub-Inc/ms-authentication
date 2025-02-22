import { RefreshTokenType } from '../utils/types/refresh-token.type';

export class RefreshToken {
  userId!: number;
  token!: string;

  constructor(refreshToken: RefreshTokenType) {
    Object.assign(this, refreshToken);
  }

  static get prefix(): string {
    return 'refresh-token/';
  }
}
