import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

//DTO - users
import { MeViewModel } from '../../../modules/auth/application/dto';

//Repository
import { CommentsRepository } from '../infrastructure/comments.repository';

//DTO
import { CommentPaginator, CommentViewModel } from './dto';

//Entity
import { CommentEntity } from '../domain/entity/comment.entity';

//Models
import { CommentInputModel, LikeInputModel } from '../api/models';

//Sort
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';
import { IComment, LikeStatus } from '../domain/interfaces/comment.interface';
@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  buildResponseComment(comment: IComment, userId?: string): CommentViewModel {
    const myStatus = comment.likesInfo.usersCommentContainer.find(
      (s) => s.userId === userId,
    );
    return {
      id: comment._id.toString(),
      content: comment.content,
      userId: comment.userId,
      userLogin: comment.userLogin,
      createdAt: comment.createdAt.toISOString(),
      likesInfo: {
        likesCount: comment.likesInfo.likesCount,
        dislikesCount: comment.likesInfo.dislikesCount,
        myStatus: myStatus ? myStatus.status : LikeStatus.NONE,
      },
    };
  }

  async createComment(
    postId: string,
    createParam: CommentInputModel,
    user: MeViewModel,
  ): Promise<CommentViewModel> {
    const post = await this.commentsRepository.getGetPost(
      new Types.ObjectId(postId),
    );
    if (!post) {
      throw new NotFoundException();
    }
    const newCommentEntity = new CommentEntity(createParam, user, postId);
    const newComment = await this.commentsRepository.createComment(
      newCommentEntity,
    );
    return this.buildResponseComment(newComment);
  }

  async updateCommentById(
    id: Types.ObjectId,
    updateParam: CommentInputModel,
    userId: string,
  ): Promise<boolean> {
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new NotFoundException();
    }
    return await this.commentsRepository.updateCommentById(id, updateParam);
  }

  async getComments(
    userId?: string,
    query?: PaginatorInputModel,
    postId?: string,
  ): Promise<CommentPaginator> {
    const post = await this.commentsRepository.getGetPost(
      new Types.ObjectId(postId),
    );
    if (!post) {
      throw new NotFoundException();
    }
    const comments = await this.commentsRepository.getComments(query, postId);
    return {
      ...comments,
      items: comments.items.map((item) =>
        this.buildResponseComment(item, userId),
      ),
    };
  }

  async getCommentById(id: Types.ObjectId, userId?: string): Promise<CommentViewModel> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) {
      throw new NotFoundException();
    }
    return this.buildResponseComment(comment, userId);
  }

  async deleteCommentById(
    id: Types.ObjectId,
    userId: string,
  ): Promise<boolean> {
    const result = await this.commentsRepository.deleteCommentById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }

  async updateLikeStatus(
    commentId: Types.ObjectId,
    likeStatus: LikeInputModel,
    userId: string,
  ) {
    await this.commentsRepository.updateLikeStatus(
      commentId,
      likeStatus,
      userId,
    );
  }
}
