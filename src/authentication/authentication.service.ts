import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { AuthenticationCode } from './authentication.model';
import { UserCredential } from '../user-credential/user-credential.model';  
@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(AuthenticationCode)
    private authenticationRepository: Repository<AuthenticationCode>,
    @InjectRepository(UserCredential)
    private userCredentialRepository: Repository<UserCredential>,
  ) {}

  async authenticate(username: string, password: string) {
    const userCredential = await this.userCredentialRepository.findOne({ where: { username } });

    if (!userCredential || userCredential.passwordHash !== password) {
      throw new NotFoundException('Invalid username or password');
    }

    const code = randomBytes(32).toString('hex');
    const authenticationCode = this.authenticationRepository.create({
      user: userCredential.user,
      code,
      grantType: 'authentication',
    });

    await this.authenticationRepository.save(authenticationCode);

    return { authenticationCode: code, grantType: 'authentication' };
  }
}
