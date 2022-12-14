import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from '../../../modules/blogs/infrastructure/blogs.repository';

@Injectable()
export class BlogCheckGuard implements CanActivate {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let blogId = request.params['blogId'];
    blogId = blogId ?? request.params['id'];
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog || blog.banInfo.isBanned) {
      throw new NotFoundException();
    }
    return true;
  }
}
