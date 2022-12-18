import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../../..//modules/blogs/api/queryRepository/blog.query.repository';

@Injectable()
export class BlogCheckGuard implements CanActivate {
  constructor(private readonly blogsQueryRepository: BlogsQueryRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const blogId = request.params['blogId'];
    const blog = await this.blogsQueryRepository.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    return true;
  }
}
