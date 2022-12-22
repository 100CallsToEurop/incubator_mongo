import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

import { UserInputModel } from '../../api/models';

import {
  IAccount,
  IEmailConfirmation,
  IPasswordRecovery,
  ISession,
  IUser,
} from '../interfaces/user.interface';



export class UserEntity {
  _id?: Types.ObjectId;
  accountData: any;
  emailConfirmation: any;
  passwordRecovery: any;
  sessions: any;

  constructor(user: UserInputModel, isConfirmed?: boolean) {
    this._id = new Types.ObjectId();
    this.accountData = {
      login: user.login,
      email: user.email,
      passwordHash: user.password,
      createdAt: new Date(),
    };
    this.emailConfirmation = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 3,
      }),
      isConfirmed: isConfirmed ? true : false,
    };
    this.passwordRecovery = {
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 3,
      }),
      isConfirmed: false,
    };
    this.sessions = {
      refreshToken: null,
      badTokens: [],
    };
  }
}
