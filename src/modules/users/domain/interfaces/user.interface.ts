import { Types } from 'mongoose';


export interface ISession {
  refreshToken: string ;
  badTokens: Array<string>;
}




export interface IAccount {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
};

export interface IEmailConfirmation{
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};

export interface IPasswordRecovery{
  passwordRecoveryCode: string;
  expirationDate: Date;
  isConfirmedPassword: boolean;
};
export interface IUser {
  _id?: Types.ObjectId;
  accountData: IAccount;
  emailConfirmation: IEmailConfirmation;
  passwordRecovery: IPasswordRecovery;
  sessions: ISession;
}
