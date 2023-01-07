import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { UsersRepository } from '../../../modules/users/infrastructure/users.repository';

@Injectable()
export class UserBlogOwnerCheckGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.params['id'];
    const user = await this.usersRepository.getUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const blogId = request.body.blogId;

    const currentUserId = request.user.userId;
    const blog = await this.usersRepository.getBlogById(blogId);
    if (blog.blogOwnerInfo.userId !== currentUserId) {
      throw new ForbiddenException();
    }
    return true;
  }
}
