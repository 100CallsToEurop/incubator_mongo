import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

//Decorators
import { Public } from '../../../common/decorators/public.decorator';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';

//Guards
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CommentUserGuard } from '../../../common/guards/comments/comments-user.guard';

//Pipe
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//Sort
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';

//Services
import { CommentsService } from '../application/comments.service';

//DTO
import { CommentPaginator, CommentViewModel } from '../application/dto';

//Models
import { CommentInputModel, LikeInputModel } from './models';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /*@Public()
  @Get()
  async getComments(
    @Query() query?: PaginatorInputModel,
  ): Promise<CommentPaginator> {
    return await this.commentsService.getComments(query);
  }*/

  @Public()
  @Get(':id')
  async getComment(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<CommentViewModel> {
    return await this.commentsService.getCommentById(id);
  }

  /*@Post()
  async createComment(
    @GetCurrentUser() user: MeViewModel,
    @Body() createCommentParams: CommentInputModel,
  ): Promise<CommentViewModel> {
    return await this.commentsService.createComment(createCommentParams, user);
  }*/

  @UseGuards(CommentUserGuard)
  @HttpCode(204)
  @Put(':commentId')
  async updateComment(
    @GetCurrentUserId() userId: string,
    @Param('commentId', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateParams: CommentInputModel,
  ) {
    await this.commentsService.updateCommentById(id, updateParams, userId);
  }

  @UseGuards(CommentUserGuard)
  @HttpCode(204)
  @Put(':commentId/like-status')
  async updateCommentLikeStatus(
    @GetCurrentUserId() userId: string,
    @Param('commentId', ParseObjectIdPipe) commentId: Types.ObjectId,
    @Body() likeStatus: LikeInputModel,
  ) {
    await this.commentsService.updateLikeStatus(commentId, likeStatus, userId);
  }

  @UseGuards(CommentUserGuard)
  @HttpCode(204)
  @Delete(':commentId')
  async deleteComment(
    @GetCurrentUserId() userId: string,
    @Param('commentId', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    await this.commentsService.deleteCommentById(id, userId);
  }
}
