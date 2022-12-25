import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { MeViewModel } from '../../../../modules/auth/application/dto';
import { CommentInputModel } from '../../api/models';
import { CommentEntity } from '../../domain/entity/comment.entity';
import {
  CommentDocument,
  CommentModelType,
} from '../../domain/interfaces/comment.interface';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { Comments } from '../../domain/model/comment.schema';

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
  constructor(
    @InjectModel(Comments.name)
    private readonly CommentModel: CommentModelType,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<CommentDocument> {
    const { createParam, user, postId } = command;

    const newCommentEntity = new CommentEntity(createParam, user, postId);
    const newComment = this.CommentModel.createComment(
      newCommentEntity,
      this.CommentModel,
    );

    await this.commentsRepository.save(newComment);

    return newComment;
  }
}
