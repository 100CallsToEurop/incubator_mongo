import { Types } from 'mongoose';
import { UserInputModel } from '../../api/models';

import { IUser } from '../interfaces/user.interface';

export class UserEntity implements IUser {
  _id?: Types.ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;

  constructor(user: UserInputModel, passwordHash) {
    this._id = new Types.ObjectId();
    this.login = user.login
    this.email = user.email
    this.passwordHash = passwordHash;
    this.createdAt = new Date();
  }
}
