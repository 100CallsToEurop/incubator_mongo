import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersQueryRepository } from '../../../modules/users/api/queryRepository/users.query.repository';

@Injectable()
export class UserCheckGuard implements CanActivate {
  constructor(private readonly usersQueryRepository: UsersQueryRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.params['id'];
    const user = await this.usersQueryRepository.checkUserById(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return true;
  }
}
