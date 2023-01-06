import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../../modules/users/api/queryRepository/users.query.repository';

@Injectable()
export class UserBlogCheckGuard implements CanActivate {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    let blogId = request.params['blogId'];
    blogId = blogId ?? request.params['id'];
    const blog = await this.usersQueryRepository.getBlogById(blogId);
    if (!blog) {
      throw new NotFoundException();
    }
    return true;
  }
}
