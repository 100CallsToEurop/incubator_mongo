import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputModel } from '../../api/models';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostByIdCommand {
  constructor(public postId: string, public updatePost: PostInputModel) {}
}

@CommandHandler(UpdatePostByIdCommand)
export class UpdatePostByIdUseCase
  implements ICommandHandler<UpdatePostByIdCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: UpdatePostByIdCommand): Promise<boolean | null> {
    const { postId, updatePost } = command;
    return await this.postsRepository.updatePost(postId, updatePost);
  }
}
