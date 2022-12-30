import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class BindWithUserCommand {
  constructor(public id: string, public userId: string) {}
}

@CommandHandler(BindWithUserCommand)
export class BindWithUserUseCase
  implements ICommandHandler<BindWithUserCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async execute(command: BindWithUserCommand): Promise<void> {
    const { id, userId } = command;
    const blog = await this.blogsRepository.getBlogById(id);
    const user = await this.usersRepository.getUserById(userId);
    blog.setBlogOwnerInfo(userId, user.getUserLogin());
    await this.blogsRepository.save(blog);
  }
}
