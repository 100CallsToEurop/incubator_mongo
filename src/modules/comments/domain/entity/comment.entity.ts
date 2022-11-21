import { Types } from 'mongoose';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { CommentInputModel } from '../../api/models';
import {
  IComment,
  ILikeInfo,
  LikeStatus,
  INewestLikes,
} from '../interfaces/comment.interface';

export class CommentEntity implements IComment {
  _id?: Types.ObjectId;
  content: string;
  userId: string;
  userLogin: string;
  postId: string;
  createdAt: Date;
  likesInfo: ILikeInfo;

  constructor(comment: CommentInputModel, user: MeViewModel, postId: string) {
    this._id = new Types.ObjectId();
    this.content = comment.content;
    this.userId = user.userId;
    this.userLogin = user.login;
    this.postId = postId;
    this.createdAt = new Date();
    this.likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.NONE,
      newestLikes: [],
    };
  }
}
