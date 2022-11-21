import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from '../../../modules/posts/application/posts.service';

@Injectable()
export class PostCheckGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const postId = request.params['postId'];
    const currentUserId = request.user['userId'];
    const postUser = await this.postsService.getPostById(postId);

    if (!postUser) {
      throw new NotFoundException();
    }

    if (postUser.blogId !== currentUserId) {
      throw new ForbiddenException();
    }
    return true;
  }
}
