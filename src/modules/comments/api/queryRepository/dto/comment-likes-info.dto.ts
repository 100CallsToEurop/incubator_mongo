import { LikeStatus } from "../../../../../modules/likes-info/domain/interfaces/likes-info.interface";

export class LikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
