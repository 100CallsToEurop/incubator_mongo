import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { LikeInputModel } from '../../api/models';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class UpdateLikeStatusCommand {
  constructor(
    public commentId: string,
    public likeStatus: LikeInputModel,
    public user: MeViewModel,
  ) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusUseCase
  implements ICommandHandler<UpdateLikeStatusCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

 
  async execute(command: UpdateLikeStatusCommand) {
    const { commentId, likeStatus, user } = command;
     const comment = await this.commentsRepository.getCommentById(commentId);
     comment.updateLikeStatus(likeStatus, user.userId, user.login);
     await this.commentsRepository.save(comment);
  }
}
