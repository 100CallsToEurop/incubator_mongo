import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputModel } from '../../api/models';
import { PostEntity } from '../../domain/entity/post.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public post: PostInputModel) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const { post } = command;
    const newPostEntity = new PostEntity(post);
    const newPost = await this.postsRepository.createPost(newPostEntity);
    return newPost;
  }
}
