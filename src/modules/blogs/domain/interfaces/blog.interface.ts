import { Types } from 'mongoose';

export interface IBlog {
  _id?: Types.ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt?: Date
}
