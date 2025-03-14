import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserCredentialModule } from './user-credential/user-credential.module';
import { UserCredentialService } from './user-credential/user-credential.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationModule } from './organization/organization.module';
import { UserService } from './user/user.service';
import { UserRoleModule } from './user-role/user-role.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { AppConfig, DatabaseConfig } from './config';
import { AuthenticationModule } from './authentication/authentication.module';
import { TokenModule } from './token/token.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    UserCredentialModule,
    OrganizationModule,
    UserRoleModule,
    UserPermissionModule,
    AuthenticationModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, UserCredentialService],
})
export class AppModule {}
