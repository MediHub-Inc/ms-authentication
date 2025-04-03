import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class RefreshToken extends Document {
  @Prop({ required: true, unique: true, maxlength: 512 })
  token: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  expiresIn: number;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Date })
  revokedAt?: Date;

  @Prop({ type: Number, default: 0 })
  refreshCount: number;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
