import { HydratedDocument, Model, Types } from 'mongoose';
import { UserInputModel } from '../../api/models';
import { UserEntity } from '../entity/user.entity';
import { User } from '../model/user.schema';
import { IConfirmation } from './abstract.confirmation.interface';


export interface ISession{
  refreshToken: string 
  badTokens: Array<string>
}
export interface ISessionMethods {
  setRefreshToken(refreshToken: string | null): void;
  getRefreshToken(): string;
  setBadToken(badTokens: string): void;
  getBadTokens(): Array<string>;
}

export type ISessionEntity = ISession & ISessionMethods;


export interface IBanInfo{
  isBanned: boolean
  banDate: Date
  banReason: string
}

export interface IBanBlogInfo {
  isBanned: boolean;
  banDate: Date;
  banReason: string;
  blogId: string
}
export interface IAccount {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  banInfo: IBanInfo;
  banBlogsInfo: IBanBlogInfo[];
}

export interface IAccountMethods {
  setLogin(login: string): void;
  getLogin(): string;
  setEmail(email: string): void;
  getEmail(): string;
  setPasswordHash(password: string): void;
  getPasswordHash(): string;
  setCreatedAt(): void;
  getCreatedAt(): Date;
  createAccountUser(createParams: UserInputModel): void;
  checkPassword(password: string): Promise<boolean>;
  getBanInfo(): IBanInfo;
  setBanInfo(isBanned: boolean, banDate: Date, banReason: string): void;
  getBanStatus(): boolean;
  addBanBlogsInfo(
    isBanned: boolean,
    banDate: Date,
    banReason: string,
    blogId: string,
  ): void;
  getBanBlogsInfo(blogId: string): IBanBlogInfo;
  deleteBanBlog(blogId: string): void;
}

export type IAccountEntity = IAccount & IAccountMethods

export interface IEmailConfirmation extends IConfirmation {}

export interface IPasswordRecovery extends IConfirmation {}

export interface IUser{
  accountData: IAccount;
  emailConfirmation: IEmailConfirmation;
  passwordRecovery: IPasswordRecovery;
  sessions: ISessionEntity;
}
export interface IUserMethods {
  getUserEmail(): string;
  checkPassword(password: string): Promise<boolean>;
  updatePassword(newPassword: string): void;
  updateRefreshToken(refreshToken: string): void;

  getMessageCode(): string;
  checkConfirmed(code: string): boolean;
  updateConfirmationState(): void;
  getConfirmationState(): boolean;

  getPasswordMessageCode(): string;
  checkPasswordConfirmed(code: string): boolean;
  updatePasswordConfirmationState(): void;
  getPasswordConfirmationState(): boolean;
}

export type IUserEntity = IUser & IUserMethods;


export type UserDocument = HydratedDocument<User>;

export type UserStaticType = {
  createUser: (
    newUserEntity: UserEntity,
    UserModel: UserModelType,
  ) => UserDocument;
};

export type UserModelType = Model<UserDocument> & UserStaticType;
