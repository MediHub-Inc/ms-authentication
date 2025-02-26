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
} from '@nestjs/common';
import { Response, Request } from 'express';
import { TokenService } from './token.service';
import { JWT_EXPIRATION_TIME_IN_MS } from 'src/utils/helpers/jwt.helper';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) {}

  /**
   * ✅ Intercambiar un authenticationCode por un accessToken + refreshToken
   */
  @Post()
  async getToken(
    @Body() { authenticationCode, grantType }: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.tokenService.exchangeCodeForToken(
      authenticationCode,
      grantType,
    );

    // ✅ Guardar en una cookie segura con `httpOnly`
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Se activa solo en producción
      sameSite: 'lax',
      maxAge: JWT_EXPIRATION_TIME_IN_MS.ACCESS_TOKEN, // 1 hora en milisegundos
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: JWT_EXPIRATION_TIME_IN_MS.REFRESH_TOKEN,
    });

    return { message: 'Tokens exchanged successfully' };
  }

  /**
   * ✅ Refrescar un token usando el refreshToken
   */
  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
      throw new UnauthorizedException('No refresh token found in cookies');
    }

    // ✅ Delegar toda la lógica de validación y generación al servicio
    const tokens = await this.tokenService.refreshToken(
      oldRefreshToken,
      req.body.grantType,
    );

    // ✅ Almacenar el nuevo accessToken en la cookie
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: JWT_EXPIRATION_TIME_IN_MS.ACCESS_TOKEN, // 1 hora
    });

    return { message: 'Access token refreshed' };
  }

  @Get('validate')
  async validateToken(@Req() req: Request) {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new UnauthorizedException('No token found in cookies');
    }
    return this.tokenService.validateToken(token);
  }
}
