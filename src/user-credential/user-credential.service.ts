import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../utils/enums/user-status.enum';
import { Repository } from 'typeorm';
import { UserCredential } from './user-credential.model';

@Injectable()
export class UserCredentialService {
  constructor(
    @InjectRepository(UserCredential)
    private readonly userCredentialRepository: Repository<UserCredential>,
  ) { }

  async createUserCredential(
    userCredential: UserCredential,
  ): Promise<UserCredential> {
    userCredential.passwordHash = await bcrypt.hash(
      userCredential.passwordHash,
      10,
    );
    const createdUserCredential = await this.userCredentialRepository.create(
      userCredential,
    );
    if (!createdUserCredential)
      throw new InternalServerErrorException(
        `User credential could not be created`,
      );

    const insertedUserCredential = await this.userCredentialRepository.save(
      createdUserCredential,
    );
    if (!insertedUserCredential)
      throw new InternalServerErrorException(
        `User credential could not be save`,
      );
    return insertedUserCredential;
  }

  async getUserByCredentials(
    username: string,
    password: string,
  ): Promise<UserCredential> {
    const nonDisabledUser = await this.userCredentialRepository
      .createQueryBuilder('uc')
      .innerJoinAndSelect('uc.user', 'user')
      .where((subQ) => {
        subQ.where('user.email = :email', { email: username });
        subQ.orWhere('uc.username = :username', { username });
      })
      .andWhere('user.status = :status', { status: UserStatus.ACTIVE })
      .getOne();

    if (!nonDisabledUser)
      throw new NotFoundException(`User with username ${username} not found!`);

    const passwordMatch = await bcrypt.compare(
      password,
      nonDisabledUser.passwordHash,
    );

    if (!passwordMatch)
      throw new ForbiddenException(
        `User credentials with username ${username} are invalid!`,
      );
    return nonDisabledUser;
  }

  async getUserCredentialByUserId(id: string): Promise<UserCredential> {
    const userCredential = await this.userCredentialRepository
      .createQueryBuilder('uc')
      .innerJoinAndSelect('uc.user', 'user')
      .where('user.id = :userId', { userId: id }) // ✅ Cambiar 'uc.userId' por 'user.id'
      .getOne();
  
    if (!userCredential) {
      throw new NotFoundException(`User credential with userId ${id} not found`);
    }
  
    return userCredential;
  }  
}
