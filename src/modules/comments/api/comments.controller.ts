import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';

//Decorators
import { Public } from '../../../common/decorators/public.decorator';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';

//Guards
import { CommentUserGuard } from '../../../common/guards/comments/comments-user.guard';

//Pipe
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//DTO
import { CommentViewModel } from './queryRepository/dto';

//Models
import { CommentInputModel, LikeInputModel } from './models';
import { CommentCheckGuard } from '../../../common/guards/comments/comments-check.guard';
import { CommentsQueryRepository } from './queryRepository/comments.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import {
  DeleteCommentByIdCommand,
  UpdateCommentByIdCommand,
  UpdateLikeStatusCommand,
} from '../application/useCases';
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';
import { MeViewModel } from '../../../modules/auth/application/dto';
import { GetCurrentUserIdPublic } from '../../../common/decorators/get-current-user-id-public.decorator';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @UseGuards(CommentCheckGuard)
  @Public()
  @Get(':id')
  async getComment(
    @GetCurrentUserIdPublic() userId: string,
    @Param('id', ParseObjectIdPipe) commentId: string,
  ): Promise<CommentViewModel> {
    return await this.commentsQueryRepository.getCommentById(commentId, userId);
  }

  @UseGuards(CommentUserGuard)
  @HttpCode(204)
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: string,
    @GetCurrentUserId() userId: string,
    @Body() updateParams: CommentInputModel,
  ) {
    await this.commandBus.execute(
      new UpdateCommentByIdCommand(commentId, updateParams, userId),
    );
  }

  @UseGuards(CommentUserGuard)
  @HttpCode(204)
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: string) {
    await this.commandBus.execute(new DeleteCommentByIdCommand(commentId));
  }

  @UseGuards(CommentCheckGuard)
  @HttpCode(204)
  @Put(':commentId/like-status')
  async updateCommentLikeStatus(
    @GetCurrentUser() user: MeViewModel,
    @Param('commentId') commentId: string,
    @Body() likeStatus: LikeInputModel,
  ) {
    await this.commandBus.execute(
      new UpdateLikeStatusCommand(commentId, likeStatus, user),
    );
  }
}
