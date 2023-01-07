import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from 'src/modules/posts/infrastructure/posts.repository';

@Injectable()
export class PostCheckBanUserGuard implements CanActivate {
  constructor(
    private readonly postsRepository: PostsRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let postId = request.params['postId'];
    postId = postId ?? request.params['id'];
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const userId = request.user.userId
    const user = await this.postsRepository.getUserById(userId);

    const blogId = post.blogId

    const bannedBlogUser = user.accountData.banBlogsInfo.map(
      (blogInfo) => blogInfo.blogId,
    );

    if (bannedBlogUser.length > 0 && bannedBlogUser.includes(blogId)){
       throw new ForbiddenException()
    }
      return true;
  }
}
