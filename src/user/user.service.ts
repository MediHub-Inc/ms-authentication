/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';
import { UserRole } from 'src/user-role/user-role.model';
import { Organization } from 'src/organization/organization.model';
import { UserCredentialService } from 'src/user-credential/user-credential.service';
import { UserCredential } from 'src/user-credential/user-credential.model';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Organization)
    private organizationRepository: Repository<Organization>,
    private userCredentialService: UserCredentialService,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [
        {
          id: String(id),
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async getUser(_id: number): Promise<User[]> {
    return await this.usersRepository.find({
      where: [{ id: String(_id) }],
      relations: ['role', 'organization'],
    });
  }
  async createUser(user: User): Promise<User> {
    const role = await this.userRoleRepository.findOne({
      where: { id: String(user.role.id) },
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${user.role.id} not found`);
    }

    const organization = await this.organizationRepository.findOne({
      where: { id: (user as any).organizationId },
    });
    if (!organization) {
      throw new NotFoundException(
        `Organization with id ${user.organization.id} not found`,
      );
    }
    user.role = role;
    user.organization = organization;
    const createdUser = this.usersRepository.create(user);

    const insertedUser = await this.usersRepository.save(createdUser);

    if ((user as any).username) {
      await this.userCredentialService.createUserCredential({
        username: (user as any).username,
        passwordHash: (user as any).password,
        user: insertedUser,
        lastLogin: new Date().toString(),
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        passwordResetHash: '',
        passwordResetExpirationDate: '',
      } as UserCredential);
    }
    if (!insertedUser)
      throw new InternalServerErrorException(`User could not be save`);
    return createdUser;
  }

  async updateUser(user: User) {
    await this.usersRepository.save(user);
  }

  async deleteUser(user: User) {
    await this.usersRepository.delete(user);
  }

  async getUserProfile(userId: string) {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.role', 'role') // 🔥 Unir con `role`
      .leftJoin('user.organization', 'organization') // 🔥 Unir con `organization`
      .select([
        'user.id',
        'user.firstName',
        'user.middleName',
        'user.familyName',
        'user.avatar',
        'user.createdAt',
        'role.id', // 🔥 Solo el `id` del rol
        'organization.id', // 🔥 Solo el `id` de la organización
      ])
      .where('user.id = :userId', { userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      firstName: user.firstName,
      middleName: user.middleName,
      familyName: user.familyName,
      avatar: user.avatar,
      createdAt: user.createdAt,
      roleId: (user as any).role?.id, // 🔥 Solo el `id` del rol
      organizationId: (user as any).organization?.id, // 🔥 Solo el `id` de la organización
    };
  }
}
