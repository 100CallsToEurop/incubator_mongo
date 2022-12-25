import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../../../modules/comments/api/queryRepository/comments.query.repository';

@Injectable()
export class CommentCheckGuard implements CanActivate {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let commentId = request.params['commentId'];
    commentId = commentId ?? request.params['id'];
    const commentUser = await this.commentsQueryRepository.getCommentById(
      commentId,
    );

    if (!commentUser) {
      throw new NotFoundException();
    }
    return true;
  }
}
