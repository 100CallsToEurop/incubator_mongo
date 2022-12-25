import { INewestLikes, IUserInfoInputModel } from "./newest-like.interface";

export enum LikeStatus {
  NONE = 'None',
  LIKE = 'Like',
  DISLIKE = 'Dislike',
}

export interface ILikeInfo {
  likesCount: number;
  dislikesCount: number
  myStatus: LikeStatus
}

export interface ILikeInfoMethods {
  updateLikeStatus(userParams: IUserInfoInputModel): void;
  getLikeStatus(userId: string): ILikeInfo;
  ban(userId: string, banned: boolean);
}

export type ILikeInfoEntity = ILikeInfo & ILikeInfoMethods;


export interface IExtendedLikesInfo extends ILikeInfo {
  newestLikes: Array<INewestLikes>;
}

export interface IExtendedLikesInfoMethods {
  updateLikeStatus(userParams: IUserInfoInputModel): void;
  getExtendedLikeStatus(userId: string): IExtendedLikesInfo;
  ban(userId: string, banned: boolean);
}
export type IExtendedLikesInfoEntity = IExtendedLikesInfo & IExtendedLikesInfoMethods;
