import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserPermission extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Module' })
  moduleId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'SubModule' })
  submoduleId?: Types.ObjectId;
}

export const UserPermissionSchema =
  SchemaFactory.createForClass(UserPermission);
