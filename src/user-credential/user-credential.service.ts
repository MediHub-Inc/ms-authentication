import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../utils/enums/user-status.enum';
import { UserCredential } from './user-credential.schema';
import { Model } from 'mongoose';
import { User } from '../user/user.schema';

@Injectable()
export class UserCredentialService {
  constructor(
    @InjectModel(UserCredential.name)
    private readonly userCredentialModel: Model<UserCredential>,
  ) {}

  async createUserCredential(
    userCredential: UserCredential,
  ): Promise<UserCredential> {
    userCredential.passwordHash = await bcrypt.hash(
      userCredential.passwordHash,
      10,
    );

    const createdUserCredential =
      await this.userCredentialModel.create(userCredential);

    if (!createdUserCredential) {
      throw new InternalServerErrorException(
        `User credential could not be created`,
      );
    }

    return createdUserCredential;
  }

  async getUserByCredentials(
    username: string,
    password: string,
  ): Promise<UserCredential> {
    const nonDisabledUser = await this.userCredentialModel
      .findOne({
        $or: [{ username }, { email: username }],
      })
      .populate<{ user: User }>('user');

    if (
      !nonDisabledUser ||
      !nonDisabledUser.user ||
      nonDisabledUser.user.status !== UserStatus.ACTIVE
    ) {
      throw new NotFoundException(`User with username ${username} not found!`);
    }

    const passwordMatch = await bcrypt.compare(
      password,
      nonDisabledUser.passwordHash,
    );

    if (!passwordMatch) {
      throw new ForbiddenException(
        `User credentials with username ${username} are invalid!`,
      );
    }

    return nonDisabledUser as unknown as UserCredential;
  }

  async getUserCredentialByUserId(id: string): Promise<UserCredential> {
    const userCredential = await this.userCredentialModel
      .findOne({ user: id })
      .populate<{ user: User }>('user');

    if (!userCredential) {
      throw new NotFoundException(
        `User credential with userId ${id} not found`,
      );
    }

    return userCredential as unknown as UserCredential;
  }
}
