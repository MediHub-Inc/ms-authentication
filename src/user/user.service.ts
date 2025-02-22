import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUsers(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: [
        {
          id,
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
      where: [{ id: _id }],
    });
  }

  async createUser(user: User): Promise<User> {
    const createdUser = await this.usersRepository.create(user);
    if (!createdUser)
      throw new InternalServerErrorException(`User could not be created`);

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
