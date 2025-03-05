/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Body,
  Post,
  Res,
  Req,
  UnauthorizedException,
  Get,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';
import { TokenService } from './token.service';
import { JWT_EXPIRATION_TIME_IN_MS } from 'src/utils/helpers/jwt.helper';
import { GrantType } from '../utils/enums/grant-type.enum';
@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  /**
   * ✅ Intercambiar un authenticationCode por un accessToken + refreshToken
   */
  @Post()
  async exchangeCodeForToken(
    @Body() { authenticationCode, grantType }: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.tokenService.exchangeCodeForToken(
      authenticationCode,
      grantType,
    );

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      domain: 'localhost',
      maxAge: JWT_EXPIRATION_TIME_IN_MS.ACCESS_TOKEN, // 1 hora en milisegundos
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      domain: 'localhost',
      maxAge: JWT_EXPIRATION_TIME_IN_MS.REFRESH_TOKEN, // 1 día en milisegundos
    });

    return { message: 'Tokens exchanged successfully' };
  }

  /**
   * ✅ Refrescar un token usando el refreshToken (One-Time Usage)
   */
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Body() { grantType }: { grantType: GrantType },
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token found in cookies');
    }

    if (grantType !== GrantType.REFRESH) {
      throw new BadRequestException(
        `Invalid grantType: expected "refresh_token", received "${grantType}"`,
      );
    }

    try {
      // ✅ Intentar refrescar el token (puede lanzar error si el refresh token ya fue usado)
      const tokens = await this.tokenService.refreshToken(
        oldRefreshToken,
        grantType,
      );

      // ✅ Almacenar el nuevo accessToken en la cookie
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        domain: 'localhost',
        maxAge: JWT_EXPIRATION_TIME_IN_MS.ACCESS_TOKEN, // 1 hora
      });

      return { message: 'Access token refreshed' };
    } catch (error) {
      console.error('Refresh Token Error:', error.message);

      // 🚨 Revocar las cookies si el refresh token ya no es válido (One-Time Usage)
      res.clearCookie('accessToken', { domain: 'localhost' });
      res.clearCookie('refreshToken', { domain: 'localhost' });

      throw error;
    }
  }

  /**
   * ✅ Valida el token JWT y retorna el usuario autenticado
   */
  @Get('validate')
  @UseGuards(AuthGuard('jwt')) // 🚀 Usa Passport para validar el token automáticamente
  async validateToken(@Req() req: any) {
    console.log(req.user);
    return req.user; // 🔥 Ahora el usuario autenticado está en `req.user`
  }
}
