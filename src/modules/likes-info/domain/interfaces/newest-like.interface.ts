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

export interface INewestLikesMethods {
  setUserId(userId: string): void;
  setStatus(status: LikeStatus): void;
  setIsBanned(isBanned: boolean): void;
  setLogin(login: string): void;
  setAddedAt(addedAt: Date): void;

  setUserInfo(userInfo: IUserInfoInputModel): void;

  getUserId(): string;
  getStatus(): string;
  getIsBanned(): boolean;
  getLogin(): string;
  getAddedAt(): Date;

  checkUserId(userId: string): boolean;
}

export type INewestLikesEntity = INewestLikes & INewestLikesMethods;
