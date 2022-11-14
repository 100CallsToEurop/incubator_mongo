import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IAccount, IEmailConfirmation, ISession, IUser } from '../interfaces/user.interface';

@Schema({ collection: 'users-account' })
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


@Schema({ collection: 'users-sessions' })
export class UserSession extends Document implements ISession {
  @Prop({ type: String })
  refreshToken?: string;
  @Prop({ type: [String] })
  badTokens?: Types.Array<string>;
}
export const UserSessionSchema = SchemaFactory.createForClass(UserSession);

@Schema({ collection: 'users-confirmation' })
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

@Schema({ collection: 'users' })
export class User extends Document implements IUser {
  @Prop({ required: true, type: UserAccountSchema })
  accountData: IAccount;
  @Prop({ required: true, type: UserEmailConfirmationSchema })
  emailConfirmation: IEmailConfirmation;
  @Prop({ type: UserSessionSchema })
  sessions: ISession;
}

export const UserSchema = SchemaFactory.createForClass(User);
