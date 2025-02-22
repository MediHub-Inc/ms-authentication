import { AuthCodeType } from '../utils/types/auth-code.type';

export class AuthCode {
  userId!: number;
  code!: string;
  token!: string;
  idToken!: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;

  constructor(authCode: AuthCodeType) {
    Object.assign(this, authCode);
  }

  static get prefix(): string {
    return 'codes/';
  }
}
