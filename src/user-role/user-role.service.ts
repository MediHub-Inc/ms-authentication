import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole } from './user-role.schema';
import { UserPermission } from '../user-permission/user-permission.schema';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UserRole as UserRoleEnum } from '../utils/enums/user-role.enum';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRole.name)
    private readonly userRoleModel: Model<UserRole>,

    @InjectModel(UserPermission.name)
    private readonly userPermissionModel: Model<UserPermission>,
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

      const permissions = await this.userPermissionModel.find({
        _id: { $in: createUserRoleDto.permissions },
      });

      if (!permissions || permissions.length === 0) {
        throw new InternalServerErrorException(
          `Invalid permissions provided for role: ${roleName}`,
        );
      }

      const createdUserRole = await this.userRoleModel.create({
        name: roleName,
        description: createUserRoleDto.description,
        isActive: createUserRoleDto.isActive ?? true,
        permissions: permissions.map((p) => p._id),
      });

      if (!createdUserRole) {
        throw new InternalServerErrorException(
          `User Role ${roleName} could not be created`,
        );
      }

      createdRoles.push(createdUserRole);
    }

    return createdRoles;
  }

  async findAll() {
    return this.userRoleModel.find().populate('permissions').exec();
  }

  async findOne(id: string) {
    const role = await this.userRoleModel
      .findById(id)
      .populate('permissions')
      .exec();

    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

    return role;
  }

  async findOneByName(roleName: string) {
    return this.userRoleModel
      .findOne({ name: roleName as UserRoleEnum })
      .populate('permissions')
      .exec();
  }

  async update(id: string, updateUserRoleDto: UpdateUserRoleDto) {
    const existingRole = await this.userRoleModel.findById(id);
    if (!existingRole) {
      throw new NotFoundException(`User Role not found`);
    }

    const updatedRole = await this.userRoleModel
      .findByIdAndUpdate(
        id,
        {
          ...updateUserRoleDto,
          permissions: updateUserRoleDto.permissions,
        },
        { new: true },
      )
      .populate('permissions')
      .exec();

    return updatedRole;
  }

  async remove(id: string) {
    return this.userRoleModel.findByIdAndDelete(id).exec();
  }
}
