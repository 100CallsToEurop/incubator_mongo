import { HydratedDocument, Model, Types } from 'mongoose';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { UserInputModel } from '../../api/models';
import { UserViewModel } from '../../api/queryRepository/dto';
import { User } from '../model/user.schema';
import { IConfirmation } from './abstract.confirmation.interface';

export interface ISession {
  setRefreshToken(refreshToken: string): void;
  getRefreshToken(): string;
  setBadToken(badTokens: string): void;
  getBadTokens(): Array<string>;
}

export interface IAccount {
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
}

export interface IEmailConfirmation extends IConfirmation {}

export interface IPasswordRecovery extends IConfirmation {}

export interface IUser {
  getUserEmail(): string;
  checkPassword(password: string): Promise<boolean>;
  updatePassword(newPassword: string): void;
  updateRefreshToken(refreshToken: string): void;

  buildPayloadResponseUser(): MeViewModel;
  buildResponseUser(): UserViewModel;

  getMessageCode(): string;
  checkConfirmed(code: string): boolean;
  updateConfirmationState(): void;
  getConfirmationState(): boolean;

  getPasswordMessageCode(): string;
  checkPasswordConfirmed(code: string): boolean;
  updatePasswordConfirmationState(): void;
  getPasswordConfirmationState(): boolean;
}


export type UserDocument = HydratedDocument<User>;

export type UserStaticType = {
  createUser: (
    createParams: UserInputModel,
    isConfirmed: boolean,
    UserModel: UserModelType,
  ) => UserDocument;
};

export type UserModelType = Model<UserDocument> & UserStaticType;
