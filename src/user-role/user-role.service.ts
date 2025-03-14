import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole } from './user-role.model';
import { DeepPartial, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPermission } from 'src/user-permission/user-permission.model';
import { UserRole as UserRoleEnum } from '../utils/enums/user-role.enum';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private userRoleRepository: Repository<UserRole>,
    @InjectRepository(UserPermission)
    private userPermissionRepository: Repository<UserPermission>,
  ) {}

  async create(createUserRoleDtoArray: CreateUserRoleDto[]) {
    if (
      !Array.isArray(createUserRoleDtoArray) ||
      createUserRoleDtoArray.length === 0
    ) {
      throw new InternalServerErrorException('No roles provided');
    }

    const createdRoles: UserRole[] = [];

    for (const createUserRoleDto of createUserRoleDtoArray) {
      const roleName = createUserRoleDto.name as UserRoleEnum;

      if (!(Object.values(UserRoleEnum) as string[]).includes(roleName)) {
        throw new InternalServerErrorException(
          `Invalid UserRoleEnum value: ${roleName}`,
        );
      }

      const permissions = await this.userPermissionRepository.findBy({
        id: In(createUserRoleDto.permissions),
      });

      if (!permissions || permissions.length === 0) {
        throw new InternalServerErrorException(
          `Invalid permissions provided for role: ${roleName}`,
        );
      }

      const createdUserRole = this.userRoleRepository.create({
        name: roleName,
        description: createUserRoleDto.description,
        isActive: createUserRoleDto.isActive,
        permissions: permissions,
      } as DeepPartial<UserRole>);

      if (!createdUserRole) {
        throw new InternalServerErrorException(
          `User Role ${roleName} could not be created`,
        );
      }

      createdRoles.push(createdUserRole);
    }

    // ✅ Guardar todos los roles en batch
    const insertedUserRoles = await this.userRoleRepository.save(createdRoles);

    if (!insertedUserRoles || insertedUserRoles.length === 0) {
      throw new InternalServerErrorException('User Roles could not be saved');
    }

    return insertedUserRoles;
  }

  findAll() {
    return this.userRoleRepository.find();
  }
  findOne(id: string) {
    return this.userRoleRepository.findOne({
      where: { id: id },
      relations: ['permissions'],
    });
  }

  findOneByName(roleName: string) {
    console.log(roleName);
    return this.userRoleRepository.findOne({
      where: { name: roleName as UserRoleEnum },
      relations: ['permissions'],
    });
  }

  async update(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    const userRole = await this.userRoleRepository.findOne({
      where: { id: String(id) },
    });
    if (!userRole)
      throw new InternalServerErrorException(`User Role could not be found`);

    const updatedData: UserRole = {
      ...updateUserRoleDto,
      permissions: updateUserRoleDto.permissions as unknown as UserPermission[],
    } as UserRole;

    await this.userRoleRepository.update(id, updatedData);
    return this.userRoleRepository.findOne({ where: { id: String(id) } });
  }

  remove(id: number) {
    return this.userRoleRepository.delete(id);
  }
}
