import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserPermission } from './user-permission.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectRepository(UserPermission)
    private userPermissionRepository: Repository<UserPermission>,
  ) {}
  async create(createUserPermissionDto: CreateUserPermissionDto[]) {
    if (
      !Array.isArray(createUserPermissionDto) ||
      createUserPermissionDto.length === 0
    ) {
      throw new BadRequestException('No permissions provided');
    }

    // ✅ Crear los permisos en batch
    const createdUserPermissions = this.userPermissionRepository.create(
      createUserPermissionDto,
    );

    // ✅ Guardar en la BD
    const insertedUserPermissions = await this.userPermissionRepository.save(
      createdUserPermissions,
    );

    return insertedUserPermissions;
  }

  findAll() {
    return this.userPermissionRepository.find();
  }
  findOne(id: string) {
    return this.userPermissionRepository.findOne({ where: { id } });
  }

  update(id: string, updateUserPermissionDto: UpdateUserPermissionDto) {
    return this.userPermissionRepository.update(id, updateUserPermissionDto);
  }

  remove(id: string) {
    return this.userPermissionRepository.delete(id);
  }
}
