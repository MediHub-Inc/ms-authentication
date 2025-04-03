// src/user/user.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserStatus } from '../utils/enums/user-status.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true, maxlength: 25 })
  firstName: string;

  @Prop({ required: true, maxlength: 25 })
  familyName: string;

  @Prop({ maxlength: 25 })
  middleName?: string;

  @Prop({ type: Types.ObjectId, ref: 'UserRole', required: true })
  roleId: Types.ObjectId;

  @Prop({ maxlength: 120 })
  avatar?: string;

  @Prop({ enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
