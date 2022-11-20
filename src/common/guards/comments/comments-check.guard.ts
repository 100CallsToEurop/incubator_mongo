import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CommentsService } from '../../../modules/comments/application/comments.service';

@Injectable()
export class CommentCheckGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params['commentId'];
    const commentUser = await this.commentsService.getCommentById(commentId);

    if (!commentUser) {
      throw new NotFoundException();
    }
    return true;
  }
}
