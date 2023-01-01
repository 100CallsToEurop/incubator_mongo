import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputModel } from '../../api/models';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostByIdCommand {
  constructor(
    public postId: string,
    public updatePost: PostInputModel,
    public blogId: string,
  ) {}
}

@CommandHandler(UpdatePostByIdCommand)
export class UpdatePostByIdUseCase
  implements ICommandHandler<UpdatePostByIdCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: UpdatePostByIdCommand): Promise<void> {
    const { postId, updatePost, blogId} = command;
    const post = await this.postsRepository.getPostById(postId, blogId);
    post.updatePost(updatePost);
    await this.postsRepository.save(post)

  }
}
