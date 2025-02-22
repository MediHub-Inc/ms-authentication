import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';
import { UserRoleService } from 'src/user-role/user-role.service';
import { UserRole } from 'src/user-role/user-role.model';
import { UserRole as UserRoleEnum } from '../utils/enums/user-role.enum';
import { Business } from 'src/business/business.model';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(UserRole) private userRoleRepository: Repository<UserRole>,
    @InjectRepository(Business) private businessRepository: Repository<Business>,
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
      select: ['firstName', 'familyName', 'middleName', 'status'],
      where: [{ id: String(_id) }],
    });
  }
  async createUser(user: User): Promise<User> {
    console.log("user: ", user);
    const role = await this.userRoleRepository.findOne({where: {id: user.role}});
    if (!role) {
      throw new NotFoundException(`Role with id ${user.role} not found`);
    }

    const business = await this.businessRepository.findOne({where: {id: (user as any).businessId }});
    if (!business) {
      throw new NotFoundException(`Business with id ${user.business.id} not found`);
    }
    user.role = role.name as UserRoleEnum;
    user.business = business as Business;
    const createdUser = this.usersRepository.create(user);

    const insertedUser = await this.usersRepository.save(createdUser);
    if (!insertedUser)
      throw new InternalServerErrorException(`User could not be save`);
    return createdUser;
  }

  async updateUser(user: User) {
    this.usersRepository.save(user);
  }

  async deleteUser(user: User) {
    this.usersRepository.delete(user);
  }
}
