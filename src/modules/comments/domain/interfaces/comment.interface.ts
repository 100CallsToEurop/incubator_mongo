import { HydratedDocument, Model, Types } from 'mongoose';
import { CommentEntity } from '../entity/comment.entity';
import { Comments } from '../../domain/model/comment.schema';
import { ILikeInfo, ILikeInfoEntity } from '../../../../modules/likes-info/domain/interfaces/likes-info.interface';
import { CommentInputModel, LikeInputModel } from '../../api/models';

export interface IComment {
  _id?: Types.ObjectId;
  content: string;
  userId: string;
  userLogin: string;
  postId: string;
  createdAt?: Date;
  likesInfo: ILikeInfo;
  
}

export interface ICommentMethods {
  updateComment(userId: string, updateParams: CommentInputModel): void;
  updateLikeStatus(
    likeStatus: LikeInputModel,
    userId: string,
    login: string,
  ): void;
  getLikeStatus(): ILikeInfo;
  banUser(banned: boolean): void;
}

export type ICommentEntity = IComment & ICommentMethods


export type CommentDocument = HydratedDocument<Comments>;

export type CommentStaticType = {
  createComment: (
    newComment: CommentEntity,
    CommentModel: CommentModelType,
  ) => CommentDocument;
};

export type CommentModelType = Model<CommentDocument> &
  CommentStaticType;
