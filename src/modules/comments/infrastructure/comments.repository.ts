import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Interfaces
import { IComment, LikeStatus } from '../domain/interfaces/comment.interface';

//Schema
import { Comments } from '../domain/model/comment.schema';
import { Post } from '../../../modules/posts/domain/model/post.schema';

//Entity
import { CommentEntity } from '../domain/entity/comment.entity';

//Models
import { CommentInputModel, LikeInputModel } from '../api/models';

//DTO
import { CommentPaginatorRepository } from '../application/dto';

//Sort
import {
  SortDirection,
  PaginatorInputModel,
} from '../../../modules/paginator/models/query-params.model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
  ) {}

  async createComment(comment: CommentEntity): Promise<IComment> {
    const newComment = new this.commentModel(comment);
    return await newComment.save();
  }

  async getCommentById(_id: Types.ObjectId): Promise<IComment> {
    return await this.commentModel.findOne({ _id }).exec();
  }

  async getComments(
    query?: PaginatorInputModel,
    postId?: string,
  ): Promise<CommentPaginatorRepository> {
    //Filter
    let filter = this.commentModel.find();
    let totalCount = (await this.commentModel.find(filter).exec()).length;

    if (postId) {
      filter.where({ postId });
      totalCount = (await this.commentModel.find(filter).exec()).length;
    }

    //Sort
    const sortDefault = 'createdAt';
    let sort = `-${sortDefault}`;
    if (query && query.sortBy && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}`)
        : (sort = `${query.sortBy}`);
    } else if (query && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${sortDefault}`)
        : (sort = sortDefault);
    } else if (query && query.sortBy) {
      sort = `-${query.sortBy}`;
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const pageSize = Number(query?.pageSize) || 10;
    const pagesCount = Math.ceil(totalCount / pageSize);
    const skip: number = (page - 1) * pageSize;

    const items = await this.commentModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(pageSize)
      .exec();
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items,
    };
  }

  async updateCommentById(
    _id: Types.ObjectId,
    update: CommentInputModel,
  ): Promise<boolean> {
    const commentUpdate = await this.commentModel
      .findOneAndUpdate({ _id }, update)
      .exec();
    return commentUpdate ? true : false;
  }

  async deleteCommentById(_id: Types.ObjectId): Promise<boolean> {
    const commentDelete = await this.commentModel
      .findOneAndDelete({ _id })
      .exec();
    return commentDelete ? true : false;
  }

  async getGetPost(_id: Types.ObjectId) {
    return await this.postModel.findOne({ _id }).exec();
  }

  async updateLikeStatus(
    commentId: Types.ObjectId,
    { likeStatus }: LikeInputModel,
    userId: string,
  ): Promise<void> {
    const currentComment = await this.commentModel
      .findOne({ _id: commentId })
      .exec();
    const index = currentComment.likesInfo.usersCommentContainer.findIndex(
      (c) => c.userId === userId,
    );

    if (index === -1) {
      currentComment.likesInfo.usersCommentContainer.push({
        userId,
        status: likeStatus,
      });

      likeStatus === LikeStatus.LIKE
        ? (currentComment.likesInfo.likesCount += 1)
        : (currentComment.likesInfo.dislikesCount += 1);
    } else {
      const oldStatus =
        currentComment.likesInfo.usersCommentContainer[index].status;

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

      currentComment.likesInfo.usersCommentContainer[index].status = likeStatus;
    }
    await currentComment.save();
  }
}
