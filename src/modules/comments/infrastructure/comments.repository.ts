import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Interfaces
import { IComment } from '../domain/interfaces/comment.interface';

//Schema
import { Comments } from '../domain/model/comment.schema';

//Entity
import { CommentEntity } from '../domain/entity/comment.entity';

//Models
import { CommentInputModel } from '../api/models';

//DTO
import { CommentPaginator, CommentViewModel } from '../application/dto';

//Sort
import {
  SortDirection,
  PaginatorInputModel,
} from '../../../modules/paginator/models/query-params.model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
  ) {}

  buildResponseComment(comment: IComment): CommentViewModel {
    return {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt.toISOString(),
    };
  }

  async createComment(comment: CommentEntity): Promise<CommentViewModel> {
    const newComment = new this.commentModel(comment);
    await newComment.save();
    return this.buildResponseComment(newComment);
  }

  async getCommentById(_id: Types.ObjectId): Promise<CommentViewModel | null> {
    const comment = await this.commentModel.findOne({ _id }).exec();
    return comment ? this.buildResponseComment(comment) : null;
  }

  async getComments(query?: PaginatorInputModel): Promise<CommentPaginator> {
    //Filter
    let filter = this.commentModel.find();
    let totalCount = (await this.commentModel.find(filter).exec()).length;

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
      items: items.map((item) => this.buildResponseComment(item)),
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
}
