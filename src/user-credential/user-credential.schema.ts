import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserCredential extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    autopopulate: true,
  })
  user: Types.ObjectId;

  @Prop({ required: true, maxlength: 25 })
  username: string;

  @Prop({ required: true, maxlength: 255 })
  email: string;

  @Prop({ required: true, maxlength: 255 })
  passwordHash: string;

  @Prop({ maxlength: 255 })
  passwordResetHash?: string;

  @Prop({ type: Date })
  lastLogin?: Date;

  @Prop({ type: Date })
  passwordResetExpirationDate?: Date;
}

export const UserCredentialSchema =
  SchemaFactory.createForClass(UserCredential);
