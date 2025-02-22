import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserPermission } from './user-permission.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermission) private userPermissionRepository: Repository<UserPermission>,
  ) {}
  async create(createUserPermissionDto: CreateUserPermissionDto) {
    const createdUserPermission = await this.userPermissionRepository.create(createUserPermissionDto);
    if (!createdUserPermission)
      throw new InternalServerErrorException(`User Permission could not be created`);

    const insertedUserPermission = await this.userPermissionRepository.save(createdUserPermission);
    if (!insertedUserPermission)
      throw new InternalServerErrorException(`User Permission could not be saved`);
    return createdUserPermission;
  }

  findAll() {
    return this.userPermissionRepository.find();
  }

  findOne(id: number) {
    return this.userPermissionRepository.findOne({ where: { id } });
  }

  update(id: number, updateUserPermissionDto: UpdateUserPermissionDto) {
    return this.userPermissionRepository.update(id, updateUserPermissionDto);
  }

  remove(id: number) {
    return this.userPermissionRepository.delete(id);
  }
}
