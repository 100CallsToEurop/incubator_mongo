import { Types } from "mongoose";

export enum LikeStatus {
  NONE = 'None',
  LIKE = 'Like',
  DISLIKE = 'Dislike',
}

export interface INewestLikes {
  userId: string;
  login: string;
  status: LikeStatus;
  addedAt: Date
}

export interface IExtendedLikesInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Array<INewestLikes>;
}

export interface IPost {
  _id?: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt?: Date;
  extendedLikesInfo: IExtendedLikesInfo;
}
