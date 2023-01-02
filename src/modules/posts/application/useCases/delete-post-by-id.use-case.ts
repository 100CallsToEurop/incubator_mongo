import { ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostByIdCommand {
  constructor(public postId: string, public blogId?: string, public userId?: string) {}
}

@CommandHandler(DeletePostByIdCommand)
export class DeletePostByIdUseCase
  implements ICommandHandler<DeletePostByIdCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: DeletePostByIdCommand): Promise<void> {
    const { postId, blogId, userId } = command;
    const post = await this.postsRepository.getPostById(postId);
    if (post.checkOwnerPost(userId)) {
      throw new ForbiddenException();
    }
    await this.postsRepository.deletePostById(postId);
  }
}
