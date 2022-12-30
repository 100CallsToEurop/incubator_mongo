import { LikeStatus } from './likes-info.interface';

export interface IUserInfoInputModel {
  likeStatus: LikeStatus;
  userId: string;
  login?: string
}


export interface INewestLikes {
  addedAt: Date;
  userId: string;
  login: string;
  status: LikeStatus;
  isBanned: boolean;
}

