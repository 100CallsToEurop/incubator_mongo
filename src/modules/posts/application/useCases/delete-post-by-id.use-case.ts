import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostByIdCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostByIdCommand)
export class DeletePostByIdUseCase
  implements ICommandHandler<DeletePostByIdCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: DeletePostByIdCommand): Promise<void> {
    const { postId } = command;
    await this.postsRepository.deletePostById(postId);
  }
}
