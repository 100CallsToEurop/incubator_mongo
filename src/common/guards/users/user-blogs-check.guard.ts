import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';

@Injectable()
export class UserBlogCheckGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let blogId = request.params['blogId'];
    blogId = blogId ?? request.params['id'];
    const blog = await this.usersRepository.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }

    const currentUserId = request.user.userId;

    if (blog.blogOwnerInfo.userId !== currentUserId) {
      throw new ForbiddenException();
    }

    return true;
  }
}
