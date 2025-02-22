import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCredential } from './user-credential.model';
import { UserCredentialService } from './user-credential.service';
import { UserCredentialController } from './user-credential.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserCredential])],
  providers: [UserCredentialService],
  exports: [UserCredentialService, TypeOrmModule.forFeature([UserCredential])],
  controllers: [UserCredentialController],
})
export class UserCredentialModule {}
