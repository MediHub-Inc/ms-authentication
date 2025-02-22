import { decode } from 'jsonwebtoken';
import { BadRequestException, Injectable } from '@nestjs/common';
import { GetAccessTokenByCodeResponse } from 'src/utils/types/get-access-token-by-code.response';
import { RefreshToken } from './refresh-token.model';
import { RefreshTokenType } from 'src/utils/types/refresh-token.type';
import { AuthenticationCodes } from 'src/auth-code/authentication-codes.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokensType } from 'src/utils/types/tokens.type';
import { AuthenticationMethod } from 'src/utils/enums/auth-method.enum';
import { AuthCodeService } from 'src/auth-code/auth-code.service';
import { UserCredential } from 'src/user-credential/user-credential.model';
import { UserCredentialService } from 'src/user-credential/user-credential.service';
import { getExpiresInFromJwt } from 'src/utils/helpers/expires-in.helper';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(AuthenticationCodes)
    private authenticationCodesRepository: Repository<AuthenticationCodes>,
    private readonly userCredentialService: UserCredentialService,
    private readonly authCodeService: AuthCodeService,
  ) {}

  async renewCredentialsFromRefreshToken(
    refreshToken: string,
  ): Promise<GetAccessTokenByCodeResponse> {
    const refreshTokenModel: RefreshToken | undefined =
      await this.getRefreshToken(refreshToken);
    if (!refreshTokenModel)
      throw new BadRequestException(
        `Invalid refresh token. May have already been used, had expired or may have been invalidated.`,
      );

    const user: UserCredential =
      await this.userCredentialService.getUserCredentialByUserId(
        refreshTokenModel.userId,
      );

    const renewTokens: TokensType = await this.renewTokensForUser(user);
    return {
      accessToken: renewTokens.accessToken || '',
      idToken: renewTokens.idToken || '',
      refreshToken: renewTokens.refreshToken || '',
      tokenType: 'bearer',
      expiresIn: renewTokens.accessTokenExp || 0,
    };
  }

  async getRefreshToken(
    refreshToken: string,
  ): Promise<RefreshToken | undefined> {
    const decodedRefreshToken = JSON.parse(
      JSON.stringify(decode(refreshToken)),
    ) as RefreshTokenType;
    const refreshTokenFromDb = await this.authenticationCodesRepository.findOne(
      {
        where: [
          {
            id: RefreshToken.prefix + decodedRefreshToken.userId,
          },
        ],
      },
    );

    if (!refreshTokenFromDb) {
      return undefined;
    }

    if (refreshTokenFromDb.token !== refreshToken) {
      return undefined;
    }
    return new RefreshToken(refreshTokenFromDb);
  }

  async renewTokensForUser(
    userCredential: UserCredential,
  ): Promise<TokensType> {
    const accessToken = await this.authCodeService.getSignedJwtToken(
      userCredential,
      AuthenticationMethod.REFRESH,
    );
    const idToken = await this.authCodeService.getSignedIdToken(userCredential);
    const refreshToken = await this.authCodeService.getSignedRefreshToken(
      userCredential,
    );
    const refreshTokenProps = {
      userId: userCredential.user.id,
      token: refreshToken,
    };
    try {
      const refreshTokenModel = new RefreshToken(refreshTokenProps);
      await this.invalidatePreviousRefreshTokenForUser(userCredential.user.id);
      const authCodes = await this.authenticationCodesRepository.create({
        id: RefreshToken.prefix + userCredential.user.id,
        token: refreshTokenModel.token,
      });
      await this.authenticationCodesRepository.save(authCodes);
    } catch (error) {
      throw new Error(error.message);
    }
    return {
      accessToken: accessToken,
      idToken,
      refreshToken,
      accessTokenExp: getExpiresInFromJwt(accessToken),
    };
  }

  async invalidatePreviousRefreshTokenForUser(userId: number): Promise<void> {
    try {
      const currentRefreshToken =
        await this.authenticationCodesRepository.findOne({
          where: [
            {
              id: RefreshToken.prefix + userId,
            },
          ],
        });
      await this.authenticationCodesRepository
        .createQueryBuilder('users')
        .delete()
        .from(AuthenticationCodes)
        .where('code = :code', {
          code: currentRefreshToken?.code,
        })
        .execute();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
