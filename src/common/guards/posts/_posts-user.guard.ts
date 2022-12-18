import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsQueryRepository } from '../../../modules/posts/api/queryRepository/posts.query.repository';

@Injectable()
export class PostCheckGuard implements CanActivate {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const postId = request.params['postId'];
    const currentUserId = request.user['userId'];
    const postUser = await this.postsQueryRepository.getPostById(postId);

    if (!postUser) {
      throw new NotFoundException();
    }

    if (postUser.blogId !== currentUserId) {
      throw new ForbiddenException();
    }
    return true;
  }
}
