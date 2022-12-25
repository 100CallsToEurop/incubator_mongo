import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputModel } from '../../api/models';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class UpdateCommentByIdCommand {
  constructor(
    public commentId: string,
    public updateParam: CommentInputModel,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateCommentByIdCommand)
export class UpdateCommentByIdUseCase
  implements ICommandHandler<UpdateCommentByIdCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentByIdCommand): Promise<void> {
    const { commentId, updateParam, userId } = command;

    const comment = await this.commentsRepository.getCommentById(commentId);
    comment.updateComment(userId, updateParam);
    await this.commentsRepository.save(comment);
  }
}
