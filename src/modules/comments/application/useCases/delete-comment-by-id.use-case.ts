import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class DeleteCommentByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(DeleteCommentByIdCommand)
export class DeleteCommentByIdUseCase
  implements ICommandHandler<DeleteCommentByIdCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentByIdCommand): Promise<void> {
    const { commentId } = command;
    await this.commentsRepository.deleteCommentById(commentId);
  }
}
