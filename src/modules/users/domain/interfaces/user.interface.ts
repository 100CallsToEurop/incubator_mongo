import { Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  login: string;
  email: string;
  passwordHash: string;
  createdAt?: Date;
}
