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

    const userBannedBlogs = user.accountData.banBlogsInfo.map(
      (item) => item.blogId,
    );

    

    const currentUserId = request.user.userId;
    const currentUserBlog = await this.usersRepository.getBlogByOwnerUserId(
      currentUserId,
    );
    const currentUserBlogId = currentUserBlog._id.toString();

    if (
      userBannedBlogs.length > 0 &&
      userBannedBlogs.includes(currentUserBlogId) &&
      currentUserBlog.blogOwnerInfo.userId !== currentUserId
    ) {
      throw new ForbiddenException();
    }
    return true;
  }
}
