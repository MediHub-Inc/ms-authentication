import {
  Injectable,
  type ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('🛑 JwtAuthGuard ejecutado');
    return super.canActivate(context); // Ejecuta la autenticación normal
  }

  handleRequest(err, user) {
    console.log('✅ Usuario autenticado:', user);
    if (err || !user) {
      console.error('❌ Error en autenticación:', err); // 🛑 Log de error
      throw new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
