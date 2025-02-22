import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthCodeController } from './auth-code/auth-code.controller';
import { AuthCodeModule } from './auth-code/auth-code.module';
import { UserCredentialModule } from './user-credential/user-credential.module';
import { AuthCodeService } from './auth-code/auth-code.service';
import { UserCredentialService } from './user-credential/user-credential.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BusinessModule } from './business/business.module';
import { UserService } from './user/user.service';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { UserRoleModule } from './user-role/user-role.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { AppConfig, DatabaseConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [AppConfig, DatabaseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthCodeModule,
    UserCredentialModule,
    BusinessModule,
    UserRoleModule,
    UserPermissionModule,
  ],
  controllers: [AppController, AuthCodeController],
  providers: [
    AppService,
    AuthCodeService,
    UserService,
    UserCredentialService,
    RefreshTokenService,
  ],
})
export class AppModule {}
