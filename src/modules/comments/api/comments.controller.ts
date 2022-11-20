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
import { Types } from 'mongoose';
import { Request } from 'express';

//Decorators
import { Public } from '../../../common/decorators/public.decorator';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';

//Guards
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { CommentUserGuard } from '../../../common/guards/comments/comments-user.guard';

//Pipe
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//Services
import { CommentsService } from '../application/comments.service';

//DTO
import { CommentViewModel } from '../application/dto';

//Models
import { CommentInputModel, LikeInputModel } from './models';
import { CommentCheckGuard } from '../../../common/guards/comments/comments-check.guard';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get(':id')
  async getComment(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Req() req: Request,
  ): Promise<CommentViewModel> {
    const token = req.cookies.refreshToken;
    return await this.commentsService.getCommentById(id, token);
  }

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

  @UseGuards(CommentCheckGuard)
  @HttpCode(204)
  @Put(':commentId/like-status')
  async updateCommentLikeStatus(
    @Req() req: Request,
    @Param('commentId', ParseObjectIdPipe) commentId: Types.ObjectId,
    @Body() likeStatus: LikeInputModel,
  ) {
    const token = req.cookies.refreshToken;
    await this.commentsService.updateLikeStatus(commentId, likeStatus, token);
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
