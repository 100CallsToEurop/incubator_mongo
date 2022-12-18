import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentInputModel } from '../../api/models';
import { CommentsRepository } from '../../infrastructure/comments.repository';


export class UpdateCommentByIdCommand {
  constructor(public commentId: string, public updateParam: CommentInputModel) {}
}

@CommandHandler(UpdateCommentByIdCommand)
export class UpdateCommentByIdUseCase
  implements ICommandHandler<UpdateCommentByIdCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentByIdCommand): Promise<boolean> {
    const { commentId, updateParam } = command;
    return await this.commentsRepository.updateCommentById(
      commentId,
      updateParam,
    );
  }
}
