import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Base } from '../../base.schema';

@Schema()
export class User extends Base {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  phone: string;

  @Prop({ type: Types.ObjectId, ref: 'Company' })
  company_id: Types.ObjectId;

  @Prop({ required: true, enum: ['admin', 'member'], default: 'member' })
  role: 'admin' | 'member';
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
