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
import { CommentInputModel } from '../api/models';

//Sort
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';
@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

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
    const newComment = new CommentEntity(createParam, user, postId);
    return await this.commentsRepository.createComment(newComment);
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
    query?: PaginatorInputModel,
    postId?: string,
  ): Promise<CommentPaginator> {
    const post = await this.commentsRepository.getGetPost(
      new Types.ObjectId(postId),
    );
    if (!post) {
      throw new NotFoundException();
    }
    return await this.commentsRepository.getComments(query, postId);
  }

  async getCommentById(id: Types.ObjectId): Promise<CommentViewModel> {
    const comment = await this.commentsRepository.getCommentById(id);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
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
}
