import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeInputModel } from '../../api/models';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class UpdateLikeStatusCommand {
  constructor(
    public commentId: string,
    public likeStatus: LikeInputModel,
    public userId: string,
  ) {}
}

CommandHandler(UpdateLikeStatusCommand);
export class UpdateLikeStatusUseCase
  implements ICommandHandler<UpdateLikeStatusCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

 
  async execute(command: UpdateLikeStatusCommand) {
    const { commentId, likeStatus, userId } = command;

     const comment = await this.commentsRepository.getCommentById(commentId);
     comment.updateLikeStatus(likeStatus, userId);
     await this.commentsRepository.save(comment);
  }
}
