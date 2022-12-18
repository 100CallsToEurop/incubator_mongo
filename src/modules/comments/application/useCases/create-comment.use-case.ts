import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { CommentInputModel } from '../../api/models';
import { CommentEntity } from '../../domain/entity/comment.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentCommand {
  constructor(
    public postId: string,
    public createParam: CommentInputModel,
    public user: MeViewModel,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const { createParam, user, postId } = command;
    const newCommentEntity = new CommentEntity(createParam, user, postId);
    const newComment = await this.commentsRepository.createComment(
      newCommentEntity,
    );
    return newComment;
  }
}
