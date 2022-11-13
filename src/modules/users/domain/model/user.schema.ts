import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';

@Schema({ collection: 'posts' })
export class User extends Document implements IUser {
  @Prop({ required: true, type: String })
  login: string;
  @Prop({ required: true, type: String })
  email: string;
  @Prop({ required: true, type: String })
  passwordHash: string;
  @Prop({ type: Date, timestamps: true })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
