import { LikeStatus } from '../../../domain/interfaces/comment.interface';

export class LikesInfoViewModel {
  likesCount: number;
  dislikesCount: number;
  myStatus: LikeStatus;
}
