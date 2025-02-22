import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BusinessService } from '../business/business.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { GrantType } from '../utils/enums/grant-type.enum';
import { setTokenInCookies } from '../utils/helpers/tokens.helper';
import { UserCredential } from '../user-credential/user-credential.model';
import { UserCredentialService } from '../user-credential/user-credential.service';
import { AuthenticationMethod } from '../utils/enums/auth-method.enum';
import { AuthenticateUserResponse } from '../utils/types/authenticate-user-response.type';
import { AuthCodeService } from './auth-code.service';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { GetAccessTokenByCodeDto } from './dtos/get-access-token-by-code.dto';
import { RegisterUserDto } from './dtos/register-user.dto';

@Controller()
export class AuthCodeController {
  constructor(
    private authCodeService: AuthCodeService,
    private userService: UserService,
    private userCredentialService: UserCredentialService,
    private businessService: BusinessService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  @Post('/authenticate')
  async authenticateUser(
    @Body() { username, password }: AuthenticateUserDto,
  ): Promise<AuthenticateUserResponse> {
    const user = await this.userCredentialService.getUserByCredentials(
      username,
      password,
    );

    const code: string =
      await this.authCodeService.generateAuthorizationCodeForUser(
        user,
        AuthenticationMethod.CREDENTIALS,
      );
    return {
      code,
      role: user.user.role,
    };
  }

  @Post('/register')
  async regiterUser(
    @Body() registerUserDto: RegisterUserDto,
  ): Promise<UserCredential> {
    //Fetch business Information by id
    const business = await this.businessService.getBusinessById(
      registerUserDto.businessId,
    );

    // Create User
    const userParams = new User({
      ...registerUserDto,
      business,
    } as unknown as User);
    const user = await this.userService.createUser(userParams);

    // Create User Credentials
    const userCredentialParams = new UserCredential({
      ...registerUserDto,
    } as unknown as UserCredential);
    return await this.userCredentialService.createUserCredential({
      ...userCredentialParams,
      passwordHash: registerUserDto.password,
      user,
    } as UserCredential);
  }

  @Post('/token')
  async getAccessTokenByCode(
    @Body() getAccessTokenByCodeDto: GetAccessTokenByCodeDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const { grant_type } = getAccessTokenByCodeDto;
    if (grant_type === GrantType.ACCESS) {
      const accessTokenData = await this.authCodeService.exchangeCodeForToken(
        getAccessTokenByCodeDto.code as string,
      );
      await setTokenInCookies(accessTokenData, res);

      res.status(201);
      res.json(accessTokenData);
    } else if (grant_type === GrantType.REFRESH) {
      const refresh_token =
        getAccessTokenByCodeDto.refresh_token ||
        req.cookies.factu_fazil_refresh_token;

      if (!refresh_token) {
        throw new BadRequestException(`refresh_token can not be empty`);
      }

      const reNewToken =
        await this.refreshTokenService.renewCredentialsFromRefreshToken(
          refresh_token,
        );

      await setTokenInCookies(reNewToken, res);
      res.status(201);
      res.json(reNewToken);
    } else {
      throw new BadRequestException(`grant_type not s upported`);
    }
  }
}
