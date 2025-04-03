import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class AuthenticationCode extends Document {
  @Prop({ unique: true, required: true })
  code: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  grantType: string;
}

export const AuthenticationCodeSchema =
  SchemaFactory.createForClass(AuthenticationCode);
