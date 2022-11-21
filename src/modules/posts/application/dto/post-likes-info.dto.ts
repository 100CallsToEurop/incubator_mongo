import { LikeStatus } from "../../domain/interfaces/post.interface";

export class LikeDetailsViewModel{
  userId: string
  login: string
  addedAt: string
}

export class ExtendedLikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
  newestLikes: Array<LikeDetailsViewModel>;
}