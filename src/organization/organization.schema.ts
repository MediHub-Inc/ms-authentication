import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Organization extends Document {
  @Prop({ required: true, maxlength: 120 })
  name: string;

  @Prop({ required: true, unique: true, maxlength: 11 })
  ruc: string;

  @Prop({ maxlength: 120 })
  logo?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
