import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
  SessionSchema,
  UserAccountSchema,
  UserEmailConfirmationSchema,
  UserPasswordRecoverySchema,
} from '.';
import {
  IAccountEntity,
  IBanBlogInfo,
  IBanInfo,
  IEmailConfirmation,
  IPasswordRecovery,
  ISessionEntity,
  IUserEntity,
  UserDocument,
  UserModelType,
  UserStaticType,
} from '../interfaces/user.interface';
import { UserEntity } from '../entity/user.entity';

@Schema({ collection: 'users' })
export class User extends Document implements IUserEntity {
  _id: Types.ObjectId;
  @Prop({ required: true, type: UserAccountSchema })
  accountData: IAccountEntity;
  @Prop({ required: true, type: UserEmailConfirmationSchema })
  emailConfirmation: IEmailConfirmation;
  @Prop({ required: true, type: UserPasswordRecoverySchema })
  passwordRecovery: IPasswordRecovery;
  @Prop({ required: true, type: SessionSchema })
  sessions: ISessionEntity;

  public static createUser(
    newUserEntity: UserEntity,
    UserModel: UserModelType,
  ): UserDocument {
    const newUser = new UserModel(newUserEntity);
    return newUser;
  }

  public getUserLogin(): string {
    return this.accountData.getLogin();
  }

  public getUserEmail(): string {
    return this.accountData.getEmail();
  }

  public getCreatedAt(): Date {
    return this.accountData.getCreatedAt();
  }

  public getMessageCode(): string {
    this.emailConfirmation.setConfirmationCode();
    const code = this.emailConfirmation.getConfirmationCode();
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

  public getBanUserInfo(): IBanInfo {
    return this.accountData.getBanInfo();
  }

  public checkBanned(): boolean {
    return this.accountData.getBanStatus();
  }

  public setBanUserInfo(
    isBanned: boolean,
    banDate: Date,
    banReason: string,
  ): void {
    this.accountData.setBanInfo(isBanned, banDate, banReason);
  }

  public getBanUserBlogInfo(blogId: string): IBanBlogInfo {
    return this.accountData.getBanBlogsInfo(blogId);
  }

  public setBanUserBlogInfo(
    isBanned: boolean,
    banDate: Date,
    banReason: string,
    blogId: string,
  ): void {
    this.accountData.addBanBlogsInfo(isBanned, banDate, banReason, blogId);
  }

  public deleteBanUserBlog(blogId: string): void{
     this.accountData.deleteBanBlog(blogId);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.methods.getUserEmail = User.prototype.getUserEmail;
UserSchema.methods.updatePassword = User.prototype.updatePassword;
UserSchema.methods.checkPassword = User.prototype.checkPassword;

UserSchema.methods.getMessageCode = User.prototype.getMessageCode;
UserSchema.methods.checkConfirmed = User.prototype.checkConfirmed;
UserSchema.methods.updateConfirmationState =
  User.prototype.updateConfirmationState;
UserSchema.methods.getConfirmationState = User.prototype.getConfirmationState;
UserSchema.methods.getUserLogin = User.prototype.getUserLogin;
UserSchema.methods.getCreatedAt = User.prototype.getCreatedAt;

UserSchema.methods.getBanUserInfo = User.prototype.getBanUserInfo;
UserSchema.methods.setBanUserInfo = User.prototype.setBanUserInfo;

UserSchema.methods.getBanUserBlogInfo = User.prototype.getBanUserBlogInfo;
UserSchema.methods.setBanUserBlogInfo = User.prototype.setBanUserBlogInfo;
UserSchema.methods.deleteBanUserBlog = User.prototype.deleteBanUserBlog;

UserSchema.methods.getPasswordMessageCode =
  User.prototype.getPasswordMessageCode;
UserSchema.methods.checkPasswordConfirmed =
  User.prototype.checkPasswordConfirmed;
UserSchema.methods.updatePasswordConfirmationState =
  User.prototype.updatePasswordConfirmationState;
UserSchema.methods.getPasswordConfirmationState =
  User.prototype.getPasswordConfirmationState;
UserSchema.methods.addBadRefreshToken = User.prototype.addBadRefreshToken;
const userStaticMethod: UserStaticType = {
  createUser: User.createUser,
};
UserSchema.statics = userStaticMethod;

UserSchema.methods.checkBanned = User.prototype.checkBanned;
UserSchema.methods.updateRefreshToken = User.prototype.updateRefreshToken;

