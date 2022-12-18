import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Interfaces
import { IComment, LikeStatus } from '../domain/interfaces/comment.interface';

//Schema
import { Comments } from '../domain/model/comment.schema';

//Entity
import { CommentEntity } from '../domain/entity/comment.entity';

//Models
import { CommentInputModel, LikeInputModel } from '../api/models';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
  ) {}

  async createComment(comment: CommentEntity): Promise<string> {
    const newComment = new this.commentModel(comment);
    await newComment.save();
    return newComment._id.toStrins()
  }

  async updateCommentById(
    commentId: string,
    update: CommentInputModel,
  ): Promise<boolean> {
    const commentUpdate = await this.commentModel
      .findOneAndUpdate({ _id: new Types.ObjectId(commentId) }, update)
      .exec();
    return commentUpdate ? true : false;
  }

  async deleteCommentById(commentId: string): Promise<boolean> {
    const commentDelete = await this.commentModel
      .findOneAndDelete({ _id: new Types.ObjectId(commentId) })
      .exec();
    return commentDelete ? true : false;
  }

  async updateLikeStatus(
    commentId: string,
    { likeStatus }: LikeInputModel,
    userId: string,
  ): Promise<void> {
    const currentComment = await this.commentModel
      .findOne({ _id: new Types.ObjectId(commentId) })
      .exec();
    const index = currentComment.likesInfo.newestLikes.findIndex(
      (c) => c.userId === userId,
    );

    if (index === -1) {
      currentComment.likesInfo.newestLikes.push({
        userId,
        status: likeStatus,
      });

      likeStatus === LikeStatus.LIKE
        ? (currentComment.likesInfo.likesCount += 1)
        : (currentComment.likesInfo.dislikesCount += 1);
    } else {
      const oldStatus = currentComment.likesInfo.newestLikes[index].status;

      if (oldStatus === LikeStatus.LIKE && likeStatus === LikeStatus.DISLIKE) {
        currentComment.likesInfo.likesCount -= 1;
        currentComment.likesInfo.dislikesCount += 1;
      }

      if (oldStatus === LikeStatus.DISLIKE && likeStatus === LikeStatus.LIKE) {
        currentComment.likesInfo.likesCount += 1;
        currentComment.likesInfo.dislikesCount -= 1;
      }

      if (oldStatus === LikeStatus.LIKE && likeStatus === LikeStatus.NONE) {
        currentComment.likesInfo.likesCount -= 1;
      }

      if (oldStatus === LikeStatus.DISLIKE && likeStatus === LikeStatus.NONE) {
        currentComment.likesInfo.dislikesCount -= 1;
      }

      if (oldStatus === LikeStatus.NONE && likeStatus === LikeStatus.LIKE) {
        currentComment.likesInfo.likesCount += 1;
      }

      if (oldStatus === LikeStatus.NONE && likeStatus === LikeStatus.DISLIKE) {
        currentComment.likesInfo.dislikesCount += 1;
      }

      currentComment.likesInfo.newestLikes[index].status = likeStatus;
    }
    await currentComment.save();
  }
}
