import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { RefreshToken } from '../refresh-token/refresh-token.model';
import { isOneHourAgo } from '../utils/helpers/date.helper';
import { getExpiresInFromJwt } from '../utils/helpers/expires-in.helper';
import { AuthCodeType } from '../utils/types/auth-code.type';
import { GetAccessTokenByCodeResponse } from '../utils/types/get-access-token-by-code.response';
import { Repository } from 'typeorm';
import { UserCredential } from '../user-credential/user-credential.model';
import { defaults } from '../utils/constants/defaults';
import { AuthenticationMethod } from '../utils/enums/auth-method.enum';
import { TokenEnum } from '../utils/enums/token.enum';
import { signToken } from '../utils/helpers/jwt-signer.helper';
import { AuthCode } from './auth-code.model';
import { AuthenticationCodes } from './authentication-codes.model';

@Injectable()
export class AuthCodeService {
  constructor(
    @InjectRepository(AuthenticationCodes)
    private authenticationCodesRepository: Repository<AuthenticationCodes>,
  ) {}

  async generateAuthorizationCodeForUser(
    userCredential: UserCredential,
    authenticationMethod: AuthenticationMethod,
  ): Promise<string> {
    const code = randomBytes(32).toString('hex');
    const token = await this.getSignedJwtToken(
      userCredential,
      authenticationMethod,
    );
    const idToken = await this.getSignedIdToken(userCredential);
    const refreshToken = await this.getSignedRefreshToken(userCredential);
    const authCodeProps = {
      user: userCredential.user,
      code,
      token,
      idToken,
      refreshToken,
      id: AuthCode.prefix + userCredential.user.id,
    };
    const refreshTokenProps = {
      user: userCredential.user,
      code,
      token: refreshToken,
      id: RefreshToken.prefix + userCredential.user.id,
    };
    // save auth code (access_token)
    const authCode = this.authenticationCodesRepository.create(authCodeProps);
    await this.authenticationCodesRepository.save(authCode);

    // save refresh token
    const refreshTokenModel =
      this.authenticationCodesRepository.create(refreshTokenProps);
    const refreshCode =
      this.authenticationCodesRepository.create(refreshTokenModel);
    await this.authenticationCodesRepository.save(refreshCode);

    // return code
    return authCode.code;
  }

  async getSignedJwtToken(
    userCredential: UserCredential,
    authenticationMethod: AuthenticationMethod,
  ): Promise<string> {
    const tokenData = {
      type: TokenEnum.USER,
      id: userCredential.user.id,
      role: userCredential.user.role,
      firstName: userCredential.user.firstName,
      authenticationMethod,
      email: userCredential.user.email,
    };
    const expiresIn = process.env.JWT_EXPIRE || defaults.JWT_EXPIRE;
    return signToken(tokenData, expiresIn);
  }

  async getSignedIdToken(userCredential: UserCredential): Promise<string> {
    const tokenData = {
      type: TokenEnum.USER,
      id: userCredential.user.id,
      role: userCredential.user.role,
      firstName: userCredential.user.firstName,
      email: userCredential.user.email,
    };
    const expiresIn = process.env.JWT_EXPIRE || defaults.JWT_EXPIRE;
    return signToken(tokenData, expiresIn);
  }

  async getSignedRefreshToken(userCredential: UserCredential): Promise<string> {
    const tokenData = {
      userId: userCredential.user.id,
    };
    const expiresIn = process.env.JWT_EXPIRE || defaults.JWT_EXPIRE;
    return signToken(tokenData, expiresIn);
  }

  async getAuthCodeByCode(code: string): Promise<AuthCode | undefined> {
    const codeFromDb = await this.authenticationCodesRepository.find({
      where: [
        {
          code,
        },
      ],
    });

    if (!codeFromDb.length) {
      return undefined;
    }

    for (const code of codeFromDb) {
      const isOneHourOld = await isOneHourAgo(code.createdAt);
      if (isOneHourOld) {
        await this.authenticationCodesRepository
          .createQueryBuilder('authentication_codes')
          .delete()
          .from(AuthenticationCodes)
          .where('id = :id', {
            id: code.id,
          })
          .execute();
      }
    }

    const authenticationCode: AuthCodeType = codeFromDb[0] as AuthCodeType;

    return new AuthCode(authenticationCode);
  }

  async exchangeCodeForToken(
    code: string,
  ): Promise<GetAccessTokenByCodeResponse> {
    const authCode: AuthCode | undefined = await this.getAuthCodeByCode(code);
    if (!authCode) {
      throw new BadRequestException(
        `Invalid code. May have already been used, had expired or a new code could have been generated.`,
      );
    }

    return {
      accessToken: authCode.token,
      idToken: authCode.idToken,
      refreshToken: authCode.refreshToken || '',
      tokenType: 'bearer',
      expiresIn: getExpiresInFromJwt(authCode.token),
    };
  }
}
