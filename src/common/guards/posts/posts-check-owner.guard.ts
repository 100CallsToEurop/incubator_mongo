import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from '../../../modules/posts/infrastructure/posts.repository';

@Injectable()
export class PostCheckOwnerGuard implements CanActivate {
  constructor(private readonly postsRepository: PostsRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let postId = request.params['postId'];
    postId = postId ?? request.params['id'];
    let userId = request.user['userId'];
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    if (post.checkOwnerPost(userId)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
