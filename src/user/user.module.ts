import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.model';
import { UserRole } from '../user-role/user-role.model';
import { Organization } from '../organization/organization.model';
import { UserCredentialModule } from '../user-credential/user-credential.module';
import { JwtStrategy } from '../authentication/strategies/jwt.strategy';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRole, Organization]),
    UserCredentialModule,
    PassportModule.register({ defaultStrategy: 'jwt' }), // 🔥 Asegurar `Passport` disponible
    JwtModule.register({}), // 🔥 Registrar `JwtModule`
  ],
  providers: [UserService, JwtStrategy, JwtAuthGuard], // 🔥 Agregar estrategia y guard
  controllers: [UserController],
  exports: [
    UserService,
    TypeOrmModule.forFeature([User]),
    JwtStrategy,
    JwtAuthGuard,
  ], // 🔥 Exportar para otros módulos
})
export class UserModule {}
