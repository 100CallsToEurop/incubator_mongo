import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsRepository } from '../../../modules/blogs/infrastructure/blogs.repository';

@Injectable()
export class BlogCheckOwnerGuard implements CanActivate {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let blogId = request.params['blogId'];
    let userId = request.user["userId"];
    console.log(userId);
    blogId = blogId ?? request.params['id'];
    const blog = await this.blogsRepository.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    if (blog.checkOwnerBlog(userId)) {
      throw new ForbiddenException();
    }
    return true;
  }
}
