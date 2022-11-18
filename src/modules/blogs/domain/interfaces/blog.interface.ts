import { Types } from 'mongoose';

export interface IBlog {
  _id?: Types.ObjectId;
  name: string;
  description: string
  websiteUrl: string;
  createdAt?: Date;
}
