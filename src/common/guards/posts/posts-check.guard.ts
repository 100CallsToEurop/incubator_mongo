import {
  CanActivate,
  ExecutionContext,
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
    const postUser = await this.postsService.getPostById(postId);

    if (!postUser) {
      throw new NotFoundException();
    }
    return true;
  }
}
