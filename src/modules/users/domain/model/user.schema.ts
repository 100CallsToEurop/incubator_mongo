import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IAccount, IBanInfo, IEmailConfirmation, IPasswordRecovery, IUser } from '../interfaces/user.interface';

@Schema({ collection: 'users-ban' })
export class BanInfo extends Document implements IBanInfo {
  @Prop({ required: true })
  banDate: Date;
  @Prop({ required: true })
  banReason: string;
  @Prop({ required: true, default: false })
  isBanned: boolean;
}
export const BanInfoSchema = SchemaFactory.createForClass(BanInfo);

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
  @Prop({ required: true, type: BanInfoSchema })
  banInfo: IBanInfo;
}
export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);

@Schema({ collection: 'users-password-recovery' })
export class UserPasswordRecovery extends Document implements IPasswordRecovery {
  @Prop({ required: true, type: String })
  passwordRecoveryCode: string;
  @Prop({ required: true, type: Date })
  expirationDate: Date;
  @Prop({ required: true, type: Boolean, default: false })
  isConfirmedPassword: boolean;
}
export const UserPasswordRecoverySchema =
  SchemaFactory.createForClass(UserPasswordRecovery);

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
  @Prop({ required: true, type: UserPasswordRecoverySchema })
  passwordRecovery: IPasswordRecovery;
}

export const UserSchema = SchemaFactory.createForClass(User);
