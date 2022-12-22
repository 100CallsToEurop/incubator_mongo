import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import {
  SessionSchema,
  UserAccountSchema,
  UserEmailConfirmationSchema,
  UserPasswordRecoverySchema,
} from '.';
import { UserInputModel } from '../../api/models';
import {
  IAccount,
  IEmailConfirmation,
  IPasswordRecovery,
  ISession,
  IUser,
  UserDocument,
  UserModelType,
  UserStaticType,
} from '../interfaces/user.interface';
import { UserViewModel } from '../../api/queryRepository/dto';
import { UserEntity } from '../entity/user.entity';

@Schema({ collection: 'users' })
export class User extends Document implements IUser {
  _id: Types.ObjectId;
  @Prop({ required: true, type: UserAccountSchema })
  accountData: IAccount;
  @Prop({ required: true, type: UserEmailConfirmationSchema })
  emailConfirmation: IEmailConfirmation;
  @Prop({ required: true, type: UserPasswordRecoverySchema })
  passwordRecovery: IPasswordRecovery;
  @Prop({ required: true, type: SessionSchema })
  sessions: ISession;

  public static createUser(
    newUserEntity: UserEntity,
    UserModel: UserModelType,
  ): UserDocument {
    const newUser = new UserModel(newUserEntity);
    return newUser;
  }

  public getUserEmail(): string {
    return this.accountData.getEmail();
  }

  public getMessageCode(): string {
    this.emailConfirmation.setConfirmationCode();
    const code = this.emailConfirmation.getConfirmationCode();
    console.log((code))
    const emailMessage = `To verify your email, go to 
 <a href="https://somesite.com/confirm-email?code=${code}">
 there</a>"`;
    return emailMessage;
  }

  public checkConfirmed(code: string): boolean {
    return this.emailConfirmation.checkEmailConfirmation(code);
  }

  public updateConfirmationState(): void {
    this.emailConfirmation.setIsConfirmed(true);
  }

  public getConfirmationState(): boolean {
    return this.emailConfirmation.getIsConfirmed();
  }

  public checkPasswordConfirmed(code: string): boolean {
    return this.passwordRecovery.checkEmailConfirmation(code);
  }

  public updatePasswordConfirmationState(): void {
    this.passwordRecovery.setIsConfirmed(true);
  }

  public getPasswordConfirmationState(): boolean {
    return this.passwordRecovery.getIsConfirmed();
  }

  public getPasswordMessageCode(): string {
    this.passwordRecovery.setConfirmationCode();
    const code = this.passwordRecovery.getConfirmationCode();
    const emailMessage = `To finish password recovery please follow the link below: 
    <a href="https://somesite.com/password-recovery?recoveryCode=${code}">
    recovery password</a>"`;
    return emailMessage;
  }

  public updatePassword(newPassword: string): void {
    this.accountData.setPasswordHash(newPassword);
  }

  public updateRefreshToken(refreshToken: string | null): void {
    this.sessions.setRefreshToken(refreshToken);
  }

  public addBadRefreshToken(refreshToken: string): void {
    this.sessions.setBadToken(refreshToken);
  }

  public async checkPassword(password: string): Promise<boolean> {
    return await this.accountData.checkPassword(password);
  }

  public buildPayloadResponseUser(): MeViewModel {
    return {
      userId: this._id.toString(),
      email: this.accountData.getEmail(),
      login: this.accountData.getLogin(),
    };
  }

  public buildResponseUser(): UserViewModel {
    return {
      id: this._id.toString(),
      login: this.accountData.getLogin(),
      email: this.accountData.getEmail(),
      createdAt: this.accountData.getCreatedAt().toISOString(),
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.getUserEmail = User.prototype.getUserEmail;
UserSchema.methods.updatePassword = User.prototype.updatePassword;
UserSchema.methods.checkPassword = User.prototype.checkPassword;

UserSchema.methods.updateRefreshToken = User.prototype.updateRefreshToken;
UserSchema.methods.buildPayloadResponseUser =
  User.prototype.buildPayloadResponseUser;
UserSchema.methods.buildResponseUser = User.prototype.buildResponseUser;

UserSchema.methods.getMessageCode = User.prototype.getMessageCode;
UserSchema.methods.checkConfirmed = User.prototype.checkConfirmed;
UserSchema.methods.updateConfirmationState =
  User.prototype.updateConfirmationState;
UserSchema.methods.getConfirmationState = User.prototype.getConfirmationState;

UserSchema.methods.getPasswordMessageCode =
  User.prototype.getPasswordMessageCode;
UserSchema.methods.checkPasswordConfirmed =
  User.prototype.checkPasswordConfirmed;
UserSchema.methods.updatePasswordConfirmationState =
  User.prototype.updatePasswordConfirmationState;
UserSchema.methods.getPasswordConfirmationState =
  User.prototype.getPasswordConfirmationState;

const userStaticMethod: UserStaticType = {
  createUser: User.createUser,
};
UserSchema.statics = userStaticMethod;
