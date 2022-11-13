import { Types } from 'mongoose';

export interface IComment {
  _id?: Types.ObjectId;
  content: string;
  userId: string;
  userLogin: string;
  postId: string;
  createdAt?: Date;
}
