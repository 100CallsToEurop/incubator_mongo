import { Types } from 'mongoose';

export enum LikeStatus {
  NONE = 'None',
  LIKE = 'Like',
  DISLIKE = 'Dislike',
}

export interface IUsersCommentContainer {
  userId: string;
  status: LikeStatus;
}

export interface ILikeInfo {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  usersCommentContainer: Array<IUsersCommentContainer>;
}

export interface IComment {
  _id?: Types.ObjectId;
  content: string;
  userId: string;
  userLogin: string;
  postId: string;
  createdAt?: Date;
  likesInfo: ILikeInfo;
}
