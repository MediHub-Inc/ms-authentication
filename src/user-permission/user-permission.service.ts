import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserPermissionDto } from './dto/create-user-permission.dto';
import { UpdateUserPermissionDto } from './dto/update-user-permission.dto';
import { UserPermission } from './user-permission.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserPermissionService {
  constructor(
    @InjectModel(UserPermission.name)
    private readonly userPermissionModel: Model<UserPermission>,
  ) {}

  async create(createUserPermissionDto: CreateUserPermissionDto[]) {
    if (
      !Array.isArray(createUserPermissionDto) ||
      createUserPermissionDto.length === 0
    ) {
      throw new BadRequestException('No permissions provided');
    }

    // ✅ Crear en batch con Mongoose
    const insertedUserPermissions = await this.userPermissionModel.insertMany(
      createUserPermissionDto,
    );

    return insertedUserPermissions;
  }

  findAll() {
    return this.userPermissionModel.find().exec();
  }

  findOne(id: string) {
    return this.userPermissionModel.findById(id).exec();
  }

  update(id: string, updateUserPermissionDto: UpdateUserPermissionDto) {
    return this.userPermissionModel.findByIdAndUpdate(
      id,
      updateUserPermissionDto,
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return this.userPermissionModel.findByIdAndDelete(id);
  }
}
