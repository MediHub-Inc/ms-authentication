import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.schema';
import { UserRole } from '../user-role/user-role.schema';
import { Organization } from '../organization/organization.schema';
import { UserCredentialService } from '../user-credential/user-credential.service';
import { UserCredential } from '../user-credential/user-credential.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly usersModel: Model<User>,

    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRole>,

    @InjectModel(Organization.name)
    private readonly organizationModel: Model<Organization>,

    private readonly userCredentialService: UserCredentialService,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.usersModel.find().exec();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async getUser(id: string): Promise<User[]> {
    return this.usersModel
      .find({ _id: id })
      .populate('role organization')
      .exec();
  }

  async createUser(
    user: Partial<User> & { username?: string; password?: string },
  ): Promise<User> {
    if (!user.roleId) {
      throw new NotFoundException(`Role ID is required`);
    }

    if (!user.organizationId) {
      throw new NotFoundException(`Organization ID is required`);
    }

    const role = await this.userRoleModel.findById(user.roleId);
    if (!role) {
      throw new NotFoundException(`Role with id ${user.roleId} not found`);
    }

    const organization = await this.organizationModel.findById(
      user.organizationId,
    );
    if (!organization) {
      throw new NotFoundException(
        `Organization with id ${user.organizationId} not found`,
      );
    }

    const createdUser = await this.usersModel.create({
      ...user,
      roleId: role._id,
      organizationId: organization._id,
    });

    if (user.username && user.password) {
      await this.userCredentialService.createUserCredential({
        username: user.username,
        passwordHash: user.password,
        user: createdUser._id,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        passwordResetHash: '',
        passwordResetExpirationDate: '',
      } as unknown as UserCredential);
    }

    return createdUser;
  }

  async updateUser(user: User): Promise<void> {
    await this.usersModel.updateOne({ _id: user._id }, user).exec();
  }

  async deleteUser(user: User): Promise<void> {
    await this.usersModel.deleteOne({ _id: user._id }).exec();
  }

  async getUserProfile(userId: string) {
    const user = await this.usersModel
      .findById(userId)
      .populate<{ role: UserRole; organization: Organization }>([
        { path: 'role', select: '_id' },
        { path: 'organization', select: '_id' },
      ])
      .select(
        'firstName middleName familyName avatar createdAt role organization',
      )
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id,
      firstName: user.firstName,
      middleName: user.middleName,
      familyName: user.familyName,
      avatar: user.avatar,
      createdAt: user.createdAt,
      roleId: user.role?._id,
      organizationId: user.organization?._id,
    };
  }
}
