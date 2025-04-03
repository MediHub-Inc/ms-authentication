import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserCredential, UserCredentialSchema } from './user-credential.schema';
import { UserCredentialService } from './user-credential.service';
import { UserCredentialController } from './user-credential.controller';
import { User, UserSchema } from '../user/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCredential.name, schema: UserCredentialSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [UserCredentialService],
  exports: [UserCredentialService],
  controllers: [UserCredentialController],
})
export class UserCredentialModule {}
