import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from '../../../modules/comments/application/comments.service';

@Injectable()
export class CommentUserGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params['commentId'];
    const currentUserId = request.user['userId'];
    const commentUser = await this.commentsService.getCommentById(commentId);

    if (!commentUser) {
      throw new NotFoundException();
    }

    if (commentUser.userId !== currentUserId) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
