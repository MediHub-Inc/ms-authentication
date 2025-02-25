import { Controller, Get, Body, Post, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { TokenService } from './token.service';
import { JWT_EXPIRATION_TIME_IN_MS } from 'src/utils/helpers/jwt.helper';

@Controller('token')
export class TokenController {
  constructor(private tokenService: TokenService) { }

  /**
   * ✅ Intercambiar un authenticationCode por un accessToken + refreshToken
   */
  @Post()
  async getToken(@Body() { authenticationCode, grantType }: any, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.tokenService.exchangeCodeForToken(authenticationCode, grantType);

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
async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const oldRefreshToken = req.cookies?.refreshToken;

    if (!oldRefreshToken) {
        throw new UnauthorizedException('No refresh token found in cookies');
    }

    // 🚨 Buscar el refresh token en la base de datos
    const refreshToken = await this.tokenService.validateAndRevokeRefreshToken(oldRefreshToken);

    if (!refreshToken) {
        throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    // ✅ Generar nuevos tokens
    const tokens = await this.tokenService.generateNewTokens(refreshToken.user.id);

    // ✅ Almacenar el nuevo accessToken en la cookie
    res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 3600000, // 1 hora
    });

    // ✅ Almacenar el nuevo refreshToken en la cookie
    res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return { message: 'Access token refreshed' };
}

}
