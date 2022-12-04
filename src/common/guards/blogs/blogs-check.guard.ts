import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BlogsService } from '../../../modules/blogs/application/blogs.service';

@Injectable()
export class BlogCheckGuard implements CanActivate {
  constructor(private readonly blogsService: BlogsService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const blogId = request.params['blogId'];
    const blog = await this.blogsService.getBlogById(blogId);

    if (!blog) {
      throw new NotFoundException();
    }
    return true;
  }
}
