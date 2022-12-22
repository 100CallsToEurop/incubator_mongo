import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Paginated } from "../../../../modules/paginator/models/paginator";
import { PaginatorInputModel, SortDirection } from "src/modules/paginator/models/query-params.model";
import { CommentViewModel } from "./dto";
import { Comments } from "../../domain/model/comment.schema";
import { Post } from "../../../../modules/posts/domain/model/post.schema";
import { IComment, LikeStatus } from "../../domain/interfaces/comment.interface";

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comments.name) private readonly commentModel: Model<Comments>,
  ) {}

  private buildResponseAllComment(comment: IComment): CommentViewModel{
     let myStatus;
     const index_current_user = comment.likesInfo.newestLikes.findIndex(
      (c) => c.userId === comment.userId)

      index_current_user !== -1
      ? (myStatus = comment.likesInfo.newestLikes.find(
            (s) => s.userId === comment.userId,
          ).status)
      : (myStatus = LikeStatus.NONE)
      return {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt.toISOString(),
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: myStatus,
      },
    };
     
  }

  private buildResponseComment(comment: IComment, userId?: string): CommentViewModel {
    let myStatus;

    const index_current_user = comment.likesInfo.newestLikes.findIndex(
      (c) => c.userId === userId,
    );

    userId
      ? index_current_user !== -1
        ? (myStatus = comment.likesInfo.newestLikes.find(
            (s) => s.userId === userId,
          ).status)
        : (myStatus = LikeStatus.NONE)
      : (myStatus = LikeStatus.NONE)

    return {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt.toISOString(),
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: myStatus,
      },
    };
  }

  async getCommentById(commentId: string): Promise<CommentViewModel> {
    const comment =  await this.commentModel
      .findOne({ _id: new Types.ObjectId(commentId) })
      .exec();
      if(!comment){
        throw new NotFoundException()
      }
    return this.buildResponseComment(comment)

  }

  async getGetPost(postId: string) {
    return await this.postModel
      .findOne({ _id: new Types.ObjectId(postId) })
      .exec();
  }

  async getComments(
    query?: PaginatorInputModel,
    postId?: string,
  ): Promise<Paginated<CommentViewModel[]>> {
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

    //Filter
    let filter = this.commentModel.find();

    if (postId) {
      filter.where({ postId });
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountComments = await this.commentModel.count(filter);

    const comments = await this.commentModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();
    const paginatedComments = Paginated.getPaginated<CommentViewModel[]>({
      items: comments.map((comment) =>
        this.buildResponseComment(comment),
      ),
      page: page,
      size: size,
      count: totalCountComments,
    });

    return paginatedComments;
  }
}