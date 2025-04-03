import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole as UserRoleEnum } from '../utils/enums/user-role.enum';

@Schema({ timestamps: true })
export class UserRole extends Document {
  @Prop({ required: true, enum: UserRoleEnum })
  name: UserRoleEnum;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'UserPermission', default: [] })
  permissions: Types.ObjectId[];
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
