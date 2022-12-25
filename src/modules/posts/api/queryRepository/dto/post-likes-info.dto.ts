import { LikeStatus } from "../../../../../modules/likes-info/domain/interfaces/likes-info.interface";

export class LikeDetailsViewModel {
  userId: string;
  login: string;
  addedAt: string;
}

export class ExtendedLikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Array<LikeDetailsViewModel>;
}
