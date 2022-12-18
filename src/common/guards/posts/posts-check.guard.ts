import {
  CanActivate,
  ExecutionContext,
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
    const postUser = await this.postsQueryRepository.getPostById(postId);

    if (!postUser) {
      throw new NotFoundException();
    }
    return true;
  }
}
