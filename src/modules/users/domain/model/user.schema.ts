import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IAccount, IEmailConfirmation, IUser } from '../interfaces/user.interface';

@Schema()
export class UserAccount extends Document implements IAccount {
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true })
  createdAt: Date;
}
export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);

@Schema()
export class UserEmailConfirmation
  extends Document
  implements IEmailConfirmation
{
  @Prop({ required: true, type: String })
  confirmationCode: string;
  @Prop({ required: true, type: Date })
  expirationDate: Date;
  @Prop({ required: true, type: Boolean, default: false })
  isConfirmed: boolean;
}
export const UserEmailConfirmationSchema = SchemaFactory.createForClass(
  UserEmailConfirmation,
);

@Schema({ collection: 'posts' })
export class User extends Document implements IUser {
  @Prop({ required: true, type: UserAccountSchema })
  accountData: IAccount;
  @Prop({ required: true, type: UserEmailConfirmationSchema })
  emailConfirmation: IEmailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);
