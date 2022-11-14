import { Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

import { UserInputModel } from '../../api/models';

import { IAccount, IEmailConfirmation, ISession, IUser } from '../interfaces/user.interface';

export class UserEntity implements IUser {
  _id?: Types.ObjectId;
  accountData: IAccount;
  emailConfirmation: IEmailConfirmation;
  sessions: ISession;

  constructor(user: UserInputModel, passwordHash) {
    this._id = new Types.ObjectId();
    this.accountData = {
      login: user.login,
      email: user.email,
      passwordHash,
      createdAt: new Date(),
    };
    this.emailConfirmation = {
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
