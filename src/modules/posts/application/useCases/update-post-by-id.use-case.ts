import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputModel } from '../../api/models';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostByIdCommand {
  constructor(public postId: string, public updatePost: PostInputModel, public userId: string) {}
}

@CommandHandler(UpdatePostByIdCommand)
export class UpdatePostByIdUseCase
  implements ICommandHandler<UpdatePostByIdCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: UpdatePostByIdCommand): Promise<void> {
    const { postId, updatePost, userId } = command;
    const post = await this.postsRepository.getPostById(postId);
    post.updatePost(userId, updatePost);
    await this.postsRepository.save(post)

  }
}
