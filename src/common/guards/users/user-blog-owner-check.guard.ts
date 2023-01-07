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
    const blogId = request.body.blogId;
    const currentUserId = request.user.userId;
    const currentUserBlog = await this.usersRepository.getBlogByOwnerUserId(
      currentUserId,
    );
    const currentUserBlogId = currentUserBlog._id.toString();

    if (blogId !== currentUserBlogId) {
      throw new ForbiddenException();
    }
    return true;
  }
}
