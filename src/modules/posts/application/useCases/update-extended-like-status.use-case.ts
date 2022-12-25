import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { LikeInputModel } from '../../api/models';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdateExtendedLikeStausCommand {
  constructor(
    public postId: string,
    public likeStatus: LikeInputModel,
    public user: MeViewModel,
  ) {}
}

@CommandHandler(UpdateExtendedLikeStausCommand)
export class UpdateExtendedLikeStausUseCase
  implements ICommandHandler<UpdateExtendedLikeStausCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(command: UpdateExtendedLikeStausCommand) {
    const { postId, likeStatus, user } = command;
    
    const post = await this.postsRepository.getPostById(postId);
    post.updateLikeStatus(likeStatus, user.userId, user.login);
    await this.postsRepository.save(post);

  }
}
